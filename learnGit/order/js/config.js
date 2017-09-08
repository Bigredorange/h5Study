/**
 * Created by Administrator on 2015/6/24.
 */
var user ={
     userId:'20422',
     name:'super',
     code:'',
     tel:'',
     userCode:'',
     IntegralDefineId:'',
     ProjectId:'',
     ProposerId:[],
     HandlerId:'',
     IntegralId:''
};

//正式地址
//var url = 'http://192.168.175.78:927/Server.svc/api/invoke';
// var url = 'http://192.168.175.78:928/Server.svc/api/invoke';
//var url = 'http://192.168.68.175:880/Server.svc/api/invoke';
//var url = 'http://192.168.1.55:20171/ims/';
var url = 'http://ims.bears.com.cn:20171/ims/com.sie.crm.mobile.mservice.serviceMoblic.biz.ext';


function daysBetween(DateOne,DateTwo)
{
    var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
    var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
    var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));

    var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));
    var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));

    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);
    return Math.abs(cha);
}

function daysBetween2(date){
    if(date==null||date==undefined||date==''){
        return ''
    }
    var a =moment(date).format('YYYY-MM-DD');
    var b =moment().format('YYYY-MM-DD');
    return daysBetween(b,a);
}