
//路由配置
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'view/login.html',
    }).state('register', {
        url: '/register',
        templateUrl: 'view/register.html',
    }).state('myBill', {
        url: '/myBill',
        templateUrl: 'view/myBill.html',
    }).state('setup', {
        url: '/setup',
        templateUrl: 'view/setup.html',
    })




}]);