/* groovylint-disable NestedBlockDepth */
pipeline {
    environment {
        app = ''
        registryCredential = 'dnbl-dockerhub'
    }

    agent any

        stages {
            stage('checkout source') {
                steps {
                    git 'https://github.com/danleuc/sorter.git'
                }
            }

            stage('docker build') {
                steps {
                    script {
                        app = docker.build 'dnbl/sorter'
                    }
                }
            }

            stage('docker push') {
                steps {
                    script {
                        docker.withRegistry( '', registryCredential ) {
                            app.push("$BUILD_NUMBER")
                            app.push('latest')
                        }
                    }
                }
            }

            stage('deploy app') {
                steps {
                    script {
                        kubernetesDeploy(configs: 'k8s-deploy.yaml', kubeconfigId: 'kubeconfig-minikube')
                    }
                }
            }
        }
}
