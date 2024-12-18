pipeline {
    agent any

    environment {
        NODE_HOME = 'C:\\Program Files\\nodejs'  // ชี้ไปที่ตำแหน่ง Node.js บน Windows
        PATH = "${env.NODE_HOME}\\bin;${env.PATH}" // เพิ่ม Node.js ลงใน PATH
    }

    stages {
        stage('Checkout') {
            steps {
                // ดึงข้อมูลจาก Git repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // ติดตั้ง dependencies ผ่าน npm
                script {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                // รันการทดสอบ
                script {
                    bat 'npm test'
                }
            }
        }

        stage('Build') {
            steps {
                // การ build โค้ด (ถ้ามีขั้นตอนนี้)
                script {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        always {
            // ขั้นตอนที่ต้องทำทุกครั้งหลังจาก pipeline เสร็จ เช่น การ clean up
            echo 'Pipeline complete!'
        }
        success {
            echo 'Build was successful!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
