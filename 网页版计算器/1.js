function 获取输出栏函数(){
    return  document.getElementById('输出栏的值').innerText
}

function 获取历史栏函数(){
    return  document.getElementById('历史栏的值').innerText
}

function  打印历史栏函数(参数){
    return  document.getElementById('历史栏的值').innerText=参数
}

function  打印输出栏函数(参数){
    return  document.getElementById('输出栏的值').innerText=参数
}

运算符对象=document.getElementsByClassName('运算符')
数字对象=document.getElementsByClassName('数字')


for(i=0; i<数字对象.length; i++){
    数字对象[i].addEventListener('click',function(){
        输出栏的值=获取输出栏函数()
        输出栏的值+=this.id
        打印输出栏函数(输出栏的值)
    })
}


for(i=0; i<运算符对象.length; i++){
    运算符对象[i].addEventListener('click',function(){
        if(this.id=='清空'){
            打印历史栏函数('')
            打印输出栏函数('')
        }else if(this.id=='删除一个'){
            输出栏的值=获取输出栏函数()
            if(输出栏的值){
                输出栏的值=输出栏的值.substring(0,输出栏的值.length-1)
            }
        }
        else{
            历史栏的值=获取历史栏函数()
            输出栏的值=获取输出栏函数()
            if(历史栏的值!=''&&输出栏的值==''){
                if(isNaN(历史栏的值[历史栏的值.length-1])){
                    if(this.id=="="){
                        输出栏的值=历史栏的值
                        历史栏的值=''
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
                else{
                    if(this.id=='='){
                        输出栏的值=历史栏的值
                        历史栏的值=''
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }else{
                        历史栏的值=历史栏的值+this.id
                        输出栏的值=''
                        打印历史栏函数(历史栏的值)
                        打印输出栏函数(输出栏的值)
                    }
                }
            }else  if(历史栏的值==''&&输出栏的值!=''){
                if(this.id=="="){
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }else{
                    历史栏的值=输出栏的值+this.id
                    输出栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }
            }else  if(历史栏的值!=''&&输出栏的值!=''){
                if(this.id=="="){
                    输出栏的值=eval(历史栏的值+输出栏的值)
                    历史栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }else{
                    历史栏的值=eval(历史栏的值+输出栏的值)+this.id
                    输出栏的值=''
                    打印历史栏函数(历史栏的值)
                    打印输出栏函数(输出栏的值)
                }
            }
        }
    })
}







