angular.module('snow',['angular.filter','googlechart','kendo.directives','angularUtils.directives.dirPagination'])

.config(function() {
  // Configure with icons from font-awesome
})

/* Directives */



/* Filters */


/* Services */
.factory('drop',function($rootScope){
    return {
            status: function(status) {
                $rootScope.$broadcast("drop", status);
            }    
    }
})
.factory('loading',function($rootScope){
    return {
            status: function(status) {
                $rootScope.$broadcast("loading", status);
            }    
    }
})
.factory('snowData',function($rootScope){
    return {
            data: function(data) {
                $rootScope.$broadcast("data_complete", data['Incidents']);
            }    
    }
})

/* Main Controller */
.controller('SnowCtrl',function($scope, $filter) {
    /* XLSX Panel */
    $scope.loader = false;
    $scope.hidePanel = false;
    $scope.panelTitle = 'Hide XLSX panel';
    $scope.togglePanel = function() {
        $scope.hidePanel = ($scope.hidePanel==true)?false:true;
        $scope.panelTitle = ($scope.hidePanel==true)?'Show XLSX panel':'Hide XLSX panel';
    }

    $scope.toggleLoader = function() {
        $scope.loader = ($scope.loader==true)?false:true;
    }
    
    /* Start values for date ranges */
    $scope.dateRange = {};
    $scope.dateRange['start'] = (function(){
        var year = new Date().getFullYear();
        var date = new Date(year,0,1,0,0,0);
        var month = ((date.getMonth()+1) < 10 )? '0'+(date.getMonth()+1):(date.getMonth()+1);
        var day = ((date.getDate()) < 10 )? '0'+(date.getDate()):(date.getDate());
        return new Date([date.getFullYear(),month,day].join('-')+' 00:00:00');
    })();
    $scope.dateRange['end'] = (function(){
        var year = new Date().getFullYear();
        var date = new Date(year,11,31,23,59,59);
        var month = ((date.getMonth()+1) < 10 )? '0'+(date.getMonth()+1):(date.getMonth()+1);
        var day = ((date.getDate()) < 10 )? '0'+(date.getDate()):(date.getDate());
        return new Date([date.getFullYear(),month,day].join('-')+' 23:59:59');
    })();
    
    $scope.dataLoaded = true;
    $scope.filteredData = [];
    $scope.fullData = [];
    
    /*Window Configuration */
    $scope.window;
    
    $scope.windowOptions = {
        title: 'SNOW Tickets',
        modal: true,
        width: '90%',
        height: '90%'  
    }

    $scope.openWindow = function() {
        $scope.window.open();
        $scope.window.center();
    }
    
    /*Update function, this is called everytime a filter changed*/
    $scope.update = function() {
        var filter = $scope.filter;
        angular.forEach(filter,function(value, key){
            if (value == "*") delete this[key];
        }, filter)
        $scope.filteredData = $filter('filter')($scope.fullData,filter);
        
        if($scope.dateFilter){
            var start = $scope.dateRange['start'];
                var end = $scope.dateRange['end'];
                var startdate = new Date(start.getFullYear(),start.getMonth(),start.getDate(),0,0,0);
                var enddate = new Date(end.getFullYear(),end.getMonth(),end.getDate(),23,59,59);
            var datefilteredData = $filter('filter')($scope.filteredData,function(value, index){
                var date = new Date(value["SN Opened"]);
                if(angular.isDate(date)) {
                    return ((date >= startdate) && (date <= enddate))
                } else {
                    return false;
                }
             });
            $scope.filteredData = datefilteredData;
        }
        
        $scope.compute();
    
    };
    /* Compute data and generate the widgets */
    $scope.compute = function() {
        
        $scope.datePickerConfig = {
          start  : "month",
          depth  : "month",
          format : "dd/MM/yyyy"
        };
        $scope.tabOptions = {
            background: '#000'
        }
        
        $scope.severities = [];
        angular.forEach($filter('countBy')($scope.filteredData,'Priority (from SN)'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.severities);

        $scope.ageClass = [];
        angular.forEach($filter('countBy')($scope.filteredData,'Age Class'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.ageClass);
        
        $scope.states = [];
        angular.forEach($filter('countBy')($scope.filteredData,'State'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.states);

        $scope.users = [];
        angular.forEach($filter('countBy')($scope.filteredData,'SN Assigned To'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.users);
        
        $scope.sortedUsers = ($filter('orderBy')($scope.users,'-value'));
        $scope.topUsers = ($filter('limitTo')($scope.sortedUsers,10));
        
        var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $scope.ticketMonth = [];
        angular.forEach($scope.filteredData,function(value, index){
            var date = new Date(value["SN Opened"]);
            switch(date.getMonth()) {
            case 0:
                this.push({"key": date.getFullYear()+' '+monthNames[0]});
                return true;
                break;
            case 1:
                this.push({"key": date.getFullYear()+' '+monthNames[1]});
                return true;
                break;
            case 2:
                this.push({"key": date.getFullYear()+' '+monthNames[2]});
                return true;
                break;
            case 3:
                this.push({"key": date.getFullYear()+' '+monthNames[3]});
                return true;
                break;
            case 4:
                this.push({"key": date.getFullYear()+' '+monthNames[4]});
                return true;
                break;
            case 5:
                this.push({"key": date.getFullYear()+' '+monthNames[5]});
                return true;
                break;
            case 6:
                this.push({"key": date.getFullYear()+' '+monthNames[6]});
                return true;
                break;
            case 7:
                this.push({"key": date.getFullYear()+' '+monthNames[7]});
                return true;
                break;
            case 8:
                this.push({"key": date.getFullYear()+' '+monthNames[8]});
                return true;
                break;
            case 9:
                this.push({"key": date.getFullYear()+' '+monthNames[9]});
                return true;
                break;
            case 10:
                this.push({"key": date.getFullYear()+' '+monthNames[10]});
                return true;
                break;
            case 11:
                this.push({"key": date.getFullYear()+' '+monthNames[11]});
                return true;
                    break;
            default:
                return false;
        }
        },$scope.ticketMonth);
        
        $scope.ticketsByMonth = [];
        angular.forEach($filter('countBy')($scope.ticketMonth,'key'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.ticketsByMonth);

        $scope.ticketsByApplication = [];
        angular.forEach($filter('countBy')($scope.filteredData,'Application (from SN)'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.ticketsByApplication);
        
        $scope.countries = [];
        angular.forEach($filter('countBy')($scope.filteredData,'Country'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.countries);
        
        $scope.closedBacklogNew = [];
        angular.forEach($scope.filteredData, function(value, key){
              var month = new Date(value["SN Opened"]).getMonth();
              var actualMonth = new Date().getMonth();
              var State = (value.State!='3-Closed')?(angular.equals(month,actualMonth))?'Open (New)':'Open (Backlog)':'Closed';
              $scope.closedBacklogNew.push({"State":State});
        },$scope.closedBacklogNew);
        
        $scope.closedBacklogNewCount = [];
        angular.forEach($filter('countBy')($scope.closedBacklogNew,'State'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.closedBacklogNewCount);
        
        var severitiesData = new google.visualization.DataTable();
        severitiesData.addColumn('string', 'Name');
        severitiesData.addColumn('number', 'Total');
        angular.forEach($scope.severities, function (row) {
            this.addRow([row.key, row.value]);
        },severitiesData);

        var ageClassData = new google.visualization.DataTable();
        ageClassData.addColumn('string', 'Name');
        ageClassData.addColumn('number', 'Total');
        angular.forEach($scope.ageClass, function (row) {
            this.addRow([row.key, row.value]);
        },ageClassData);
        
        var statesData = new google.visualization.DataTable();
        statesData.addColumn('string', 'Name');
        statesData.addColumn('number', 'Total');
        angular.forEach($scope.states, function (row) {
            this.addRow([row.key, row.value]);
        },statesData);
        
        var topUsersData = new google.visualization.DataTable();
        topUsersData.addColumn('string', 'Name');
        topUsersData.addColumn('number', 'Total');
        angular.forEach($scope.topUsers, function (row) {
            this.addRow([row.key, row.value]);
        },topUsersData);
        
        var monthColors = ['#2668ce','#dd3800','#ff9700','#0f9400','#98139a','#0099c7','#de4576','#66a700','#b92d2a', '#2b6396','#98469a','#17a998'];
        var ticketsByMonthData = new google.visualization.DataTable();
        ticketsByMonthData.addColumn('string', 'Month');
        ticketsByMonthData.addColumn('number', 'Total');
        ticketsByMonthData.addColumn({type: 'string', role: 'style'});
        ticketsByMonthData.addColumn({type: 'number', role: 'annotation'});
        angular.forEach($scope.ticketsByMonth, function (row, index) {
            this.addRow([row.key, row.value, 'color: '+monthColors[index]+';fill-opacity: 0.8',row.value]);
        },ticketsByMonthData);

        var applicationColors = ['#2668ce','#dd3800','#ff9700','#0f9400','#98139a','#0099c7','#de4576','#66a700','#b92d2a', '#2b6396','#98469a','#17a998'];
        var index = 0;
        var ticketsByApplicationData = new google.visualization.DataTable();
        ticketsByApplicationData.addColumn('string', 'Name');
        ticketsByApplicationData.addColumn('number', 'Total');
        ticketsByApplicationData.addColumn({type: 'string', role: 'style'});
        ticketsByApplicationData.addColumn({type: 'number', role: 'annotation'});
        angular.forEach($scope.ticketsByApplication, function (row) {
            if (index>=applicationColors.length) index=0;
            index++;
            this.addRow([row.key, row.value, 'color: '+applicationColors[index]+';fill-opacity: 0.8',row.value]);
        },ticketsByApplicationData);
        
        var countriesData = new google.visualization.DataTable();
        countriesData.addColumn('string', 'Name');
        countriesData.addColumn('number', 'Total');
        angular.forEach($scope.countries, function (row) {
            this.addRow([row.key, row.value]);
        },countriesData);
        
        var closedBacklogNewData = new google.visualization.DataTable();
        closedBacklogNewData.addColumn('string', 'Name');
        closedBacklogNewData.addColumn('number', 'Total');
        angular.forEach($scope.closedBacklogNewCount, function (row) {
            this.addRow([row.key, row.value]);
        },closedBacklogNewData);
        
        $scope.severitiesChart = {
          "type": "PieChart",
          "data": severitiesData,
          "options": {
            title: "Tickets by Priority",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'100%'
            }
          }
        };

        $scope.ageClassChart = {
          "type": "PieChart",
          "data": ageClassData,
          "options": {
            title: "Tickets by Age Class",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'100%'
            }
          }
        };
        
        $scope.statesChart = {
          "type": "PieChart",
          "data": statesData,
          "options": {
            title: "Tickets State",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'100%'
            }
            
          }
        };
        $scope.topUsersChart = {
          "type": "PieChart",
          "data": topUsersData,
          "options": {
            title: "Top 10 Assigned Users",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'100%'
            },
            pieHole: 0.4
            
          }
        };
        $scope.ticketsByMonthChart = {
          "type": "BarChart",
          "data": ticketsByMonthData,
          "options": {
            title: "Tickets By Month",
            vAxis: {title: 'Month', titleTextStyle: {color: '#fff'}, textStyle: {color:'#fff', fontSize: 11}},
            hAxis: {title: 'Tickets', titleTextStyle: {color: '#fff'}, textStyle: {color:'#fff'}},
            legend: 'none',
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            bar: {groupWidth: "92%"},
            chartArea: {
                left:80,
                top:20,
                width:'100%',
                height:'80%'
            }
            
          }
        };

        $scope.ticketsByApplicationChart = {
          "type": "BarChart",
          "data": ticketsByApplicationData,
          "options": {
            title: "Tickets By Application",
            vAxis: {title: 'Application', titleTextStyle: {color: '#fff'}, textStyle: {color:'#fff', fontSize: 8}},
            hAxis: {title: 'Tickets', titleTextStyle: {color: '#fff'}, textStyle: {color:'#fff'}},
            legend: 'none',
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            bar: {groupWidth: "75%"},
            chartArea: {
                left:80,
                top:20,
                width:'100%',
                height:'80%'
            }
            
          }
        };
        
        $scope.geoChart = {
          "type": "GeoChart",
          "data": countriesData,
          "options": {
            title: "Tickets in America",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            colorAxis: {colors: ['#2668ce', '#dd3800']},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'80%'
            }
            
          }
        };
        
        $scope.closedBacklogNewChart = {
          "type": "PieChart",
          "data": closedBacklogNewData,
          "options": {
            title: "Closed vs Backlog vs New",
            legend: {position: 'right', textStyle: {color: '#bbb', fontSize: 11}},
            backgroundColor: '#33383c',
            titleTextStyle: {color: '#fff'},
            is3D: true,
            chartArea: {
                left:0,
                top:20,
                width:'100%',
                height:'100%',

            }
            
          }
        };
        
    };
    /* Defines if the excel file is loading or not */
    $scope.$on('loading', function(event, status) {
        $scope.$apply(function(){
            $scope.dataLoaded = status;
        });
    });
    $scope.$on('drop', function(event, status) {
        $scope.$apply(function(){
            $scope.togglePanel();
            $scope.toggleLoader();
        })
    });
    /* triggers when data is loaded */
    $scope.$on('data_complete', function(event, data) {
        //console.log(data)
        $scope.toggleLoader();

        $scope.filteredData = data;
        $scope.fullData = data;
        
        $scope.datePickerConfig = {
          start  : "month",
          depth  : "month",
          format : "yyyy/MM/dd"
        };
        
        $scope.business_full = [];
        angular.forEach($filter('countBy')($scope.fullData,'Application (from SN)'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.business_full);
        
        $scope.severities_full = [];
        angular.forEach($filter('countBy')($scope.fullData,'Priority (from SN)'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.severities_full);
        
        $scope.states_full = [];
        angular.forEach($filter('countBy')($scope.fullData,'State'),function(value, key){
              this.push({"key":key,"value":value});
        },$scope.states_full);
        
        
        $scope.compute();    
    
        $scope.ths = Object.keys(data[0]);

        $scope.$apply();
    });
});

