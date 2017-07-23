define(['SuperMap'],function(SuperMap){
    var Query = {
        serviceCache : {},
        queryService : function(url,defered,dataSetName){
            if(this.serviceCache[url] !== undefined){
                return this.serviceCache.url;
            }
            return new SuperMap.REST.GetFeaturesBySQLService(url, {
                eventListeners: {
                    "processCompleted": function(resultSet){
                        var len = resultSet.result.features.length;
                        if(len > 0){
                            resultSet.result.features[0].data.tName = dataSetName;
                            return defered.resolve(resultSet.result.features);
                        }
                        return defered.reject('结果集长度为空!');
                    }, "processFailed": function(){
                        return defered.reject('查询失败!');
                    }
                }
            })
        },
        queryParameter : function(dataSourceName,dataSetName,filter){
            return  new SuperMap.REST.GetFeaturesBySQLParameters({
                returnContent: true,
                datasetNames: [dataSourceName + ":" + dataSetName],//数据源，数据集
                fromIndex: 0,
                toIndex:-1,
                queryParameter : new SuperMap.REST.FilterParameter({
                    attributeFilter : filter
                })
            });
        },
        query : function(Cesium,options){
            if(Cesium === undefined){
                return undefined;
            }
            if(!Cesium.defined(options) || !Cesium.defined(options.url) || !Cesium.defined(options.dataSourceName) || !Cesium.defined(options.dataSetName)){
                return undefined;
            }
            var url = options.url;
            var dataSourceName = options.dataSourceName;
            var dataSetName = options.dataSetName;
            var filter = options.filter || '';
            var defered = Cesium.when.defer();
            var parsObj = this.queryParameter(dataSourceName,dataSetName,filter);
            var defered = Cesium.when.defer();
            var queryService = this.queryService(url,defered,dataSetName);
            queryService.processAsync(parsObj);
            return defered;
        },
        queryByType : function(Cesium,type){
            var url = UrlSet.data_t8h;
            var dataSourceName = DataSourceNames.t8hDataSource;
            var promise = this.query(Cesium,{
                dataSourceName : dataSourceName,
                dataSetName : type,
                filter : '',
                url : url
            });
            return Cesium.when(promise,function(features){
                var ids = [];
                for(var i = 0,j = features.length;i < j;i++){
                    ids.push(features[i].data.ID);
                }
                var filter = 'Field_SmUserID in (' + ids.join(',') + ')';
                var promise = Query.query(Cesium,{
                    dataSourceName : dataSourceName,
                    dataSetName : DataSetNames.t8hDataSet,
                    filter : filter,
                    url : url
                });
                return Cesium.when(promise,function(features){
                    var smids = [];
                    for(var i = 0,j = features.length;i < j;i++){
                        smids.push(features[i].data['FIELD_SMID']);
                    }
                    return smids;
                });
            });
        },
        queryByFloor : function(Cesium,eleValue){
            var primitiveTypes = [{type :'窗',key : '标高'},{type : '门',key  : '标高'},{type : '栏杆扶手',key  : '底部标高'},{type : '楼梯',key : '底部标高'},{type : '墙',key : '底部限制条件'},{type : '楼板',key : '标高'}];//所有图元类型
            var primitiveIDS = [];
            var url = UrlSet.data_t8h;
            var dataSourceName = DataSourceNames.t8hDataSource;
            var dataSetName = '';
            var filter = '';
            for(var m = 0,n = primitiveTypes.length;m < n;m++){
                var type = primitiveTypes[m].type;
                var keyName = primitiveTypes[m].key;
                //查询所有同一层楼（同一标高ID）的对应图元类型的ids
                filter = keyName + '=' + eleValue;
                dataSetName = type;
                var promise = Query.query(Cesium,{
                    url : url,
                    dataSourceName : dataSourceName,
                    dataSetName : dataSetName,
                    filter : filter
                });
                primitiveIDS.push(promise);
            }
            return Cesium.when.all(primitiveIDS,function(arr){
                var tmpArr = [];
                for(var k = 0,l = arr.length;k < l;k++){
                    var features = arr[k];
                    for(var i = 0,j = features.length;i <j;i++){
                        tmpArr.push(features[i].data['ID']);
                    }
                }
                var filter = 'Field_SmUserID in (' + tmpArr.join(',') + ')';
                var promise = Query.query(Cesium,{
                    url : url,
                    dataSourceName : dataSourceName,
                    dataSetName : DataSetNames.t8hDataSet,
                    filter : filter
                });
                return Cesium.when(promise,function(features){
                    var ids = [];
                    for(var i = 0,j = features.length;i < j;i++){
                        ids.push(features[i].data['FIELD_SMID']);
                    }
                    return ids;
                });
            });
        },
        bufferAnalyst : function(Cesium,lon,lat){
            var point = new SuperMap.Geometry.Point(lon, lat);
            var url = UrlSet.analysis_srsb;
            var service =  new SuperMap.REST.BufferAnalystService(url);
            var bufferDistance = new SuperMap.REST.BufferDistance({
                value: 200 / (2 * Math.PI * 6378137.0) * 360
            });
            var bufferSetting = new SuperMap.REST.BufferSetting({
                endType: SuperMap.REST.BufferEndType.ROUND,
                leftDistance: bufferDistance,
                rightDistance: bufferDistance,
                semicircleLineSegment: 100
            });
            var geoBufferAnalystParam = new SuperMap.REST.GeometryBufferAnalystParameters({
                sourceGeometry: point,
                bufferSetting: bufferSetting
            });
            var defered = Cesium.when.defer();
            service.events.on({
                "processCompleted": function(BufferAnalystEventArgs){
                    var bufferResultGeometry = BufferAnalystEventArgs.result.resultGeometry;
                    return Query.queryByGeometry(bufferResultGeometry,defered);
                }
            });
            service.processAsync(geoBufferAnalystParam);
            return defered;
        },
        queryByGeometry : function(geometry,defered){
            if(!geometry){
                return;
            }
            var url = UrlSet.map_srsb;
            var queryParam, queryByGeometryParameters, queryService;
            queryParam = new SuperMap.REST.FilterParameter({name: "房屋面@vector"});
            queryByGeometryParameters = new SuperMap.REST.QueryByGeometryParameters({
                queryParams: [queryParam],
                geometry: geometry,
                spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT
            });
            queryService = new SuperMap.REST.QueryByGeometryService(url);
            queryService.events.on({
                "processCompleted": function(queryEventArgs){
                    var resultSet = queryEventArgs.result.recordsets;
                    if(resultSet.length){
                        var features = resultSet[0].features;
                        return defered.resolve(features);
                    }
                    else{
                        return defered.reject('查询结果集为空');
                    }

                },
                'processFailed' : function(){
                    return  defered.reject('查询失败');
                }
            });
            queryService.processAsync(queryByGeometryParameters);
            return defered;
        }
    };
    return  Query;
});