/* groovylint-disable NestedBlockDepth */
pipeline {
    environment {
        tag = "$env.BRANCH_NAME"
        buildnumber = "BUILD$env.BUILD_ID"
        app = ''
        registryCredential = 'dnbl-dockerhub'
        environment = 'dev'
    }

    agent any

        stages {
            stage('Checkout source') {
                steps {
                    git 'https://github.com/danleuc/sorter.git'
                }
            }

            stage('Docker build image') {
                steps {
                    script {
                        app = docker.build 'dnbl/sorter'
                    }
                }
            }

            stage('Docker push to Dockerhub') {
                steps {
                    script {
                        docker.withRegistry( '', registryCredential ) {
                            app.push(tag)
                            app.push('latest')
                        }
                    }
                }
            }
            stage('Set Environment to PROD') {
                when { tag '*' }
                steps {
                    script {
                        environment = 'prod'
                    }
                }
            }

            stage('Deploy with Helm') {
                steps {
                    withCredentials([kubeconfigContent(
                        credentialsId: 'kubeconfig-minikube',
                        variable: 'KUBECONFIG_CONTENT'
                    )]) {
                        sh 'mkdir $HOME/.kube'
                        sh '''echo "$KUBECONFIG_CONTENT" > ~/.kube/config'''
                        sh 'helm upgrade --install --wait sorter ./helm-chart/sorter --set buildnumber=' + buildnumber + ',image.tag=' + tag + ',environment=' + environment
                    }
                }
            }
        }
}
