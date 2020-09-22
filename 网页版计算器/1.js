//打印历史栏函数
function 打印历史栏函数(参数){
    document.getElementById('历史栏的值').innerText=参数
}


//打印输出栏函数
function 打印输出栏函数(参数){
    document.getElementById('输出栏的值').innerText=参数
}

//获取输出栏函数
function 获取输出栏函数(){
    return document.getElementById('输出栏的值').innerText
}

//获取历史栏函数
function 获取历史栏函数(){
    return document.getElementById('历史栏的值').innerText
}



//定义运算符的变量对象和数字的变量
运算符=document.getElementsByClassName('运算符')
数字=document.getElementsByClassName('数字')


//开始运算符的for循环
for(i=0;i<运算符.length;i++){
    运算符[i].addEventListener('click',function(){
        //如果运算符的值是清空，则把空的值打印到历史栏和输出栏
        if(this.id=='清空'){
            打印历史栏函数('')
            打印输出栏函数('')
        }
        //如果运算符的值是删除一个，则清除最后面的一个字符
        else if(this.id=="删除一个"){
            输出栏的值=获取输出栏函数().toString()
            if(输出栏的值){ //输出栏的值不为空
                输出栏的值=输出栏的值.substr(0,输出栏的值.length-1)
                打印输出栏函数(输出栏的值)
            }
        }
        //不然,，获取输出栏和历史栏的值并打印
        else{
            输出栏的值=获取输出栏函数()
            历史栏的值=获取历史栏函数()
            //如果输出栏为空，历史栏不为空
            if(输出栏的值==''&&历史栏的值!=''){
                if(isNaN(历史栏的值[历史栏的值.lengh-1])){//如果历史栏的值最后一位不是个数字
                    历史栏的值=历史栏的值.substr(0,历史栏的值.length-1)//把历史栏的值的最后一位删了
                }
            }
            if(历史栏的值!=''||输出栏的值!=''){//如果历史栏的值和输出栏的值有一项不为空,包括上面的一个条件
                历史栏的值=历史栏的值+输出栏的值//历史栏的值为历史栏的值加上输出栏的值
                if(this.id=='='){//如果运算符为等于号
                    结果=eval(历史栏的值)//计算历史栏的值这个变量，并赋值给结果
                    打印输出栏函数(结果)
                    打印历史栏函数('')//把结果打印到输出栏，历史栏显示为空
                    }
                else{
                    历史栏的值=历史栏的值+this.id//
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数('')
                }
            }
        }
    })

}


//开始数字的for循环
for(i=0;i<数字.length;i++){
    数字[i].addEventListener('click',function(){
        输出栏的值=获取输出栏函数()
        if(输出栏的值 !=NaN){//输出的值是个数字
            输出栏的值=输出栏的值+this.id
            打印输出栏函数(输出栏的值)
        }
    })
} 



