#!/usr/bin/env groovy
pipeline {
    agent any
    environment {
        registry = "cbtai-hao.tencentcloudcr.com/cbtai"
        name = 'web-react'
        tag = "0.0.7"
        // dev表示开发状态 prod表示发布状态
//         build = 'dev'
         build = 'dev'
        // 分别指定开发中对外的端口号
        http_port = '80'
        confpath = './config/web-react/ipconfig.js'
    }

    stages {
        stage('Checkout') {
            steps {
              checkout scm
            }
        }
        stage('Build Web') {
            steps {
              script {
//               sh 'export https_proxy="http://192.168.0.125:1087" export http_proxy="http://192.168.0.125:1087"'
              sh "yarn -v"
              sh "yarn install --ignore-engines"
              sh "yarn run build"
              }
            }
        }
         stage('Build Image'){
                steps {
                   script{
                     env.PATH = "/usr/local/bin:" + "${env.PATH}"
                     env.PATH = "/usr/bin:" + "${env.PATH}"
                     sh "docker build -t $registry/$name:$tag ."
                   }
                }
             }
         stage('Push Image'){
                steps {
                    script{
                       sh "docker push $registry/$name:$tag"
                   }
                }
           }
        stage('stop run image'){
            steps{
                script{
                if(build == 'dev'){
                        try{
                            sh  "docker stop $name"
                        } catch(Exception e){
                            echo '异常发生' + e.toString()
                        }
                       sleep(time:1,unit:"SECONDS")
                       try{
                            sh  "docker rm $name"
                        } catch(Exception e){
                            echo '异常发生' + e.toString()
                        }
                      sleep(time:1,unit:"SECONDS")
                    }
                }
            }
        }
        stage('run image'){
            steps{
                script{
                   if(build == 'dev'){
                      sh  "docker run --rm -d --name $name -p $http_port:80 $registry/$name:$tag"
                   }
                }
            }

        }
         stage('test image'){
            steps{
                script{
                   if(build == 'dev'){
                      sh "curl -L http://localhost:$http_port"
                   }
                }
            }
        }
    }
}

