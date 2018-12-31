pipeline {
    agent {
        label "Local_test"
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('package') {
            steps {
                sh 'npm run build'
            }
        }
        stage ('zip and copy') {
            steps {
                sh 'if [ -d store ]; then echo "Store is OK" ;else mkdir store; fi'
                sh 'cd dist; zip -r ${JOB_NAME}-${BUILD_NUMBER}.zip ./*'
                sh 'mv dist/${JOB_NAME}-${BUILD_NUMBER}.zip store'
            }
        }
    }
}
