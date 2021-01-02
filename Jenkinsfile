/* groovylint-disable NestedBlockDepth */
pipeline {
    environment {
        tag = "$env.BRANCH_NAME"
        buildnumber = "BUILD$env.BUILD_ID"
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
                            app.push(tag)
                            app.push('latest')
                        }
                    }
                }
            }
            stage('deploy app') {
                steps {
                    withCredentials([kubeconfigContent(
                        credentialsId: 'kubeconfig-minikube',
                        variable: 'KUBECONFIG_CONTENT'
                    )]) {
                        sh 'mkdir $HOME/.kube'
                        sh '''echo "$KUBECONFIG_CONTENT" > ~/.kube/config'''
                        sh 'kubectl get pods --all-namespaces'
                        sh 'helm upgrade --install --wait sorter ./helm-chart/sorter --set buildnumber=' + buildnumber + ',image.tag=' + tag
                    }
                }
            }
        }
}
