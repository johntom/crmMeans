function DailyCtrl($scope, $rootScope, masModel, masHelper, socket, $q, serviceCodes, masCrud, $location, $routeParams, $filter, DailyResource, $http, Auth, $timeout, $window) {
    //console.log(' ======================================DailyCtrl=========================', $rootScope.user);//.adjusterid)



    $scope.$on('$locationChangeStart', function (scope, next, current) {
        var flag = '';
        //console.log('length ', $scope.dailies.length)
        if ($scope.dailies.length > 0) {



            if (!$window.confirm('You have not saved your work. Are you sure you want to leave this daily view? ')) {
                //cancel leaving view2
                //works when clicking links, but doesn't work when using the back button
                scope.preventDefault();
            }
        }
    });


//        $scope.keypressCallback = function ($event) {
//            alert('Voila!');
//            $event.preventDefault();
//        };

    // $scope.myForm={};
    // console.log('DentistsCtrl $scope.myForm.$dirty',$scope.myForm.$dirty);
    $scope.usert = {
        name: 'awesome user',
        dob: new Date(1984, 0, 4)
    };
    //1
//    $scope.keypressCallback = function($event) {
//        alert('Voila!');
//        $event.preventDefault();
//    };

    $scope.keyup = function () {

    };

    $scope.submit = function () {
        alert('submit fired');
    };
    //console.log('DentistsCtrl', $rootScope.usert);

    $scope.users = [
        {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
        {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
        {id: 3, name: 'awesome user3', status: 2, group: null}
    ];

    $scope.statuses = [
        {value: 1, text: 'status1'},
        {value: 2, text: 'status2'},
        {value: 3, text: 'status3'},
        {value: 4, text: 'status4'}
    ];

    $scope.groups = [];
    $scope.loadGroups = function () {
        return $scope.groups.length ? null : $http.get('/groups').success(function (data) {
            $scope.groups = data;
        });
    };

    $scope.showGroup = function (user) {
        if (user.group && $scope.groups.length) {
            var selected = $filter('filter')($scope.groups, {id: user.group});
            return selected.length ? selected[0].text : 'Not set';
        } else {
            return user.groupName || 'Not set';
        }
    };

    $scope.showStatus = function (user) {
        var selected = [];
        if (user.status) {
            selected = $filter('filter')($scope.statuses, {value: user.status});
        }
        return selected.length ? selected[0].text : 'Not set';
    };

    $scope.checkName = function (data, id) {
        if (id === 2 && data !== 'awesome') {
            return "Username 2 should be `awesome`";
        }
    };

    // filter users to show
    $scope.filterUser = function (user) {
        return user.isDeleted !== true;
    };

    // mark user as deleted
    $scope.deleteUser = function (id) {
        var filtered = $filter('filter')($scope.users, {id: id});
        if (filtered.length) {
            filtered[0].isDeleted = true;
        }
    };

    // add user
    $scope.addUser = function () {
        $scope.users.push({
            id: $scope.users.length + 1,
            name: '',
            status: null,
            group: null,
            isNew: true
        });
    };

    // cancel all changes
    $scope.cancel = function () {
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // undelete
            if (user.isDeleted) {
                delete user.isDeleted;
            }
            // remove new
            if (user.isNew) {
                $scope.users.splice(i, 1);
            }
        }
        ;
    };

    // save edits
    $scope.saveTable = function () {
        var results = [];
        for (var i = $scope.users.length; i--;) {
            var user = $scope.users[i];
            // actually delete user
            if (user.isDeleted) {
                $scope.users.splice(i, 1);
            }
            // mark as not new
            if (user.isNew) {
                user.isNew = false;
            }

            // send on server
            results.push($http.post('/saveUser', user));
        }
        return $q.all(results);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.checkName = function (data, id) {
        //console.log('data ', data, id)
        if (id === '010' & data !== 'awesome') {
            return "Username 2 should be `awesome`";
        }
    };

    $scope.saveDaily = function (data, id) {
        //console.log('data daily1 ', data, id)
        angular.extend(data, {SERVICE_ID: data.SERVICE_ID}, {CLAIM_NO: data.CLAIM_NO}, {EXPENSE_TYPE_ID: data.EXPENSE_TYPE_ID});//
    };
    $scope.saveDailyNew = function (data, rowform) {
        //console.log('data daily2 ', data, rowform.$data)
        angular.extend(data, {SERVICE_ID: data.SERVICE_ID}, {CLAIM_NO: data.CLAIM_NO}, {EXPENSE_TYPE_ID: data.EXPENSE_TYPE_ID});//
    };

    $scope.removeDaily = function (index) {
        //   $scope.po1.Comments += ' deleted ';//+$scope.po1.details[index].AccountID;//+$scope.po1.details[index];
        //$scope.po1.details.splice(index, 1);
        $scope.dailies.splice(index, 1);
        $scope.$apply();
    };



    $scope.checkName = function (data) {
        var d = $q.defer();
        $http.post('/checkName', {value: data}).success(function (res) {
            res = res || {};
            if (res.status === 'ok') { // {status: "ok"}
                d.resolve()
            } else { // {status: "error", msg: "Username should be `awesome`!"}
                d.resolve(res.msg)
            }
        }).error(function (e) {
                d.reject('Server error!');
            });
        return d.promise;
    };


    $scope.postBatch = function (success, error) {
        //console.log('postBatch $scope.dailies ', $scope.dailies)
        var BreakException = {};
        $scope.message_err = '';
        try {
            _.each($scope.dailies, function (num) {
                    //console.log('num ', num)
                    if ((num.MODE === true) || (num.CLAIM_NO === 'Not set')) {
                        //console.log('Mode ' + num.MODE + ' ' + num.CLAIM_NO + ' - ' + num.WORK_DESCRIPTION + ' - ' + num.SERVICE_ID + ' - ' + num.SERVICE_DESC)
                        throw BreakException;
                    }
                }

            )
            $scope.process = 'process';
            //console.log('postBatch ');//, success




            //console.log('postBatch ');//, success
            var deferred = $q.defer();
            $timeout(function () {
                //do something here
                DailyResource.create({'data': $scope.dailies}, function (success, error) {
                    if (success) {
                        //console.log('create success ', success);
                        $scope.message_err = '';
                        $scope.message = 'You have successfully inserted ' + $scope.dailies.length + ' records. View File Time Sheet to modify'
                        $scope.dailies.splice(0, $scope.dailies.length);
                        $scope.process = '';
                    }
                });
                deferred.resolve();
            }, 2000);
            return deferred.promise;



        } catch (e) {
            if (e !== BreakException) throw e;
            //console.log('e ', e);
            $scope.message = '';
            $scope.message_err = ' Exception. Please fix data! '
        }

    };


    $scope.Slice = function () {
        $scope.dailies.splice(0, $scope.dailies.length);
    }

    // remove ucd
    $scope.removeUser = function (index) {
        $scope.dailies.splice(index, 1);
    };

    // add user
    $scope.addDaily = function () {
        $scope.message = '';
        //var dd = new Date("2013-03-19");
        var dd = moment().format("MM/DD/YYYY");
        //  var dd= moment().format("MM/dd/yyyy");
        Y = $scope.dailies.length + 1;
        //console.log('y ', Y, Y - 2)
        //console.log('$scope.dailies ', $scope.dailies[Y - 2])
        X = '';
        if (Y !== 1)
            X = $scope.dailies[Y - 2].CLAIM_NO;// PICK OFF LAST ENTRY

        $scope.inserted = {
            DAILY_DETAIL_ID: Y,
            DAILY_ID_: 0,
            WORK_DATE: dd,
            CLAIM_NO: X,
            ADJUSTER_ID: $rootScope.user.adjusterid,
            MODE: 1
        };

        $scope.dailies.push($scope.inserted);
    };

    $scope.getClaims = function () {
        masCrud.getClaims().then(function (result) {
            $scope.claims = result;

        });
    }
    $scope.getClaims();
    var typesPromise = serviceCodes.getCode1();
    typesPromise.then(function (result) {
        $scope.types = result;
        $scope.typesIndex = masHelper.buildIndex($scope.types, 'id');
        //console.log('$scope.types ctrl ', $scope.types);
        // $scope.currentType = $scope.typesIndex[ $scope.claim.type];
    });


    var servicePromise = serviceCodes.getCode2();
    servicePromise.then(function (result) {

        $scope.services = result;
        $scope.servicesIndex = masHelper.buildIndex($scope.services, 'id');
        //console.log('servicesIndex ', $scope.services);//Index);
    });

    var expensesPromise = serviceCodes.getCode3();
    expensesPromise.then(function (result) {
        $scope.expenses = result;
        $scope.expensesIndex = masHelper.buildIndex($scope.expenses, 'id');
        //console.log('expensesIndex ', $scope.expensesIndex);
    });


    $q.all([typesPromise, servicePromise, expensesPromise])
        .then(function () {

            var dd = moment().format("MM/DD/YYYY");

            $scope.message_err = '';
            $scope.message = '';
            $scope.process = '';
            $scope.dailies = [];// {};

        }); // end of qAll

    $scope.showClaim = function (daily) {
        //console.log('showClaim', daily, daily.CLAIM_NO)
        var selected = [];
        if (daily.CLAIM_NO) {
            selected = $filter('filter')($scope.claims, {CLAIM_NO: daily.CLAIM_NO});
            //  daily.CLAIM_NO=selected[0].CLAIM_NO;
            //console.log('showClaim selected ', selected, selected[0].CLAIM_NO);//daily.CLAIM_NO);//$scope.claims,
        }
        return selected.length ? selected[0].CLAIM_NO : 'Not set';
    };
    $scope.showService = function (daily) {
        //    console.log('showService' ,daily)
        var selected = [];
        if (daily.SERVICE_ID) {
            selected = $filter('filter')($scope.services, {id: daily.SERVICE_ID});
            daily.SERVICE_DESC = selected[0].name;
            //   console.log('selected ',daily.SERVICE_ID,selected)
        }
        return selected.length ? selected[0].name : 'Not set';
    };

    $scope.showExpesne = function (daily) {
        var selected = [];
        if (daily.EXPENSE_TYPE_ID) {
            selected = $filter('filter')($scope.expenses, {id: daily.EXPENSE_TYPE_ID});
            //  console.log('selected ',selected,selected[0].name)
            daily.EXPENSE_DESC = selected[0].name;

        }
        return selected.length ? selected[0].name : 'Not set';
    };
    //////////////////////////////////////////////
    $scope.form = {};
    $scope.isTest = null;
    $scope.form.text = 'john';
    var dd = new Date;
    var now = new Date();

    // add one week exactly
    now.setDate(now.getDate() - 7);
    $scope.form.SET_WORK_DATE1 = now;
    $scope.form.SET_WORK_DATE2 = dd;
    $scope.form.ADJUSTER_ID = 135;
    $scope.form.SET_WORK_DATEDEF = dd;
    $scope.form.SET_WORK_DATEDEFSHORT = moment(dd).format("MM/DD/YYYY");

    $scope.postDaily = function () {

    }


    $scope.setCurrentStatus = function (status) {
        if (typeof $scope.currentClaim !== 'undefined') {
            $scope.currentClaim.status = status.name;
        }
    };
    $scope.setCurrentType = function (type) {
        if (typeof $scope.currentClaim !== 'undefined') {
            $scope.currentClaim.type = type.name;
        }
    };

    $scope.setCurrentService = function (service) {
        //console.log('service ', service)
        if (typeof $scope.currentDaily !== 'undefined') {
            $scope.currentDaily.service = service.name;
            $scope.currentDaily.SERVICE_ID = service.id;
            $scope.currentDaily.servicedesc = service.name
            //console.log('servicename ', service.name);//alert
        }
    };
    $scope.setCurrentExpense = function (expense) {
        if (typeof $scope.currentDaily !== 'undefined') {
            $scope.currentDaily.expense = expense.name;
            $scope.currentDaily.expensedesc = expense.name;
            $scope.currentDaily.EXPENSE_TYPE_ID = expense.id;
        }

    };
}
