function 打印历史栏函数(参数){
    document.getElementById('历史栏的值').innerText=参数
}


function 打印输出栏函数(参数){
    document.getElementById('输出栏的值').innerText=参数
}


function 获取输出栏函数(){
    return  document.getElementById('输出栏的值').innerText
}


function 获取历史栏函数(){
    return  document.getElementById('历史栏的值').innerText
}



//定义运算符和数字的变量对象
运算符对象=document.getElementsByClassName('运算符')
数字对象=document.getElementsByClassName('数字')

//开始运算符的监听for循环
for(i=0;i<运算符对象.length;i++){
    运算符对象[i].addEventListener('click',function(){
        if(this.id=='清空'){
            打印历史栏函数('')
            打印输出栏函数('')
        }   
        else if(this.id=='删除一个'){
            输出栏的值=获取输出栏函数().toString()
            if(输出栏的值)  //输出栏的值不为空
                输出栏的值=输出栏的值.substr(0,输出栏的值.length-1)
                打印输出栏函数(输出栏的值)
        }
        else{
            输出栏的值=获取输出栏函数()
            历史栏的值=获取历史栏函数()
            if(历史栏的值!=''&&输出栏的值==''){//如果仅历史栏的值不为空
                if(isNaN(历史栏的值[历史栏的值.length-1])){//如果历史栏最后一位不是数字
                    历史栏的值=历史栏的值.substr(0,历史栏的值.length-1)
                    if(this.id=='='){
                        输出栏的值=历史栏的值
                        历史栏的值=空
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }
                    else{
                        历史栏的值=历史栏的值+this.id
                        输出栏的值=''
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }
                }else{//如果历史栏最后一位是数字
                    if(this.id=='='){
                        输出栏的值=历史栏的值
                        历史栏的值=空
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }
                    else{
                        历史栏的值=历史栏的值+this.id
                        输出栏的值=''
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }
                }
            }else if(历史栏的值==''&&输出栏的值!=''){//如果仅输出栏不为空
                if(this.id=='='){//如果运算符为=
                    历史栏的值=''
                    输出栏的值=输出栏的值
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }else{//其他
                    历史栏的值=输出栏的值+this.id
                    输出栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }
            }else if(历史栏的值!=''&&输出栏的值!=''){//历史栏和输出栏都不为空
                if(this.id=='='){//运算符为等号
                    输出栏的值=eval(历史栏的值+输出栏的值)
                    历史栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }else{//运算符不为等号
                    历史栏的值=eval(历史栏的值+输出栏的值)+this.id
                    输出栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }
            }

            

        }

    })

}



//开始数字的监听for循环
for(i=0;i<数字对象.length;i++){
    数字对象[i].addEventListener('click',function(){
        输出栏的值=获取输出栏函数()
        输出栏的值=输出栏的值+this.id
        打印输出栏函数(输出栏的值)
    
   })
}
