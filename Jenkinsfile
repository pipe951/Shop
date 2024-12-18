pipeline {
    agent any

    environment {
        // กำหนด PATH สำหรับ npm
        PATH = "C:\\Program Files\\nodejs\\;${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // ดึงโค้ดจาก Git repository
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // ติดตั้ง dependencies จาก package.json
                    echo 'Installing dependencies...'
                    bat 'npm install' // ใช้คำสั่ง npm บน Windows
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building...'
                bat 'npm run build'  // สร้างโค้ดใน Windows
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test'  // รันการทดสอบ
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to production...'
                bat 'xcopy /E /I /H * C:\\Users\\Pipe\\Desktop\\test'  // ตัวอย่างการคัดลอกไฟล์ใน Windows
            }
        }
    }
     post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
