node {
    def commitId

    stage('prepare'){
        checkout scm
        sh "git rev-parse --short HEAD > .git/commit-id"
        commitId = readFile('.git/commit-id').trim()
    }

    stage('test'){
        nodejs(nodeJSInstallationName: 'NodeJS'){
        sh 'npm install --only=dev'
        sh 'npm test'
}
    }

    stage('docker build'){
        docker.withRegistry('https://index.docker.io/v1/', 'eab0721e-cf6d-4965-aca6-57b2d3f54774') {
           def app = docker.build("dnbl/sorter:${commitId}", ".")
        }
    }

    stage('docker push'){
        app.push()
    }
}