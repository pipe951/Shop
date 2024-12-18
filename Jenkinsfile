pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                // ใช้คำสั่ง build เช่น mvn หรือ npm หากมี
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
                // รันคำสั่งทดสอบ เช่น mvn test หรือ npm test
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                // ใช้คำสั่งดีพลอย เช่น scp, rsync หรือ kubectl
            }
        }
    }
}
