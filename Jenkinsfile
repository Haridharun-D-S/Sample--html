pipeline{
    agent any
    
    environment{
        prev = "${env.BUILD_NUMBER.toInteger() - 1}"
    }
    stages{
        stage('Clean'){
            steps{
                echo "Cleaing older images and containers"
                sh '''
                    docker rm -f demo || true
                    docker rmi -f app:${prev} || true
                '''
                
            }
        }
        stage('Build'){
            steps{
                echo "Image building"
                sh "docker build -t app:${BUILD_NUMBER} ."
            }
        }
        stage('Launch'){
            steps{
                echo "App launching"
                sh "docker run -d -p 8000:80 --name demo app:${BUILD_NUMBER}"
            }
        }
    }
}
