node {
    def commitId
    def app

    def to = emailextrecipients([
        [$class: 'CulpritsRecipientProvider'],
        [$class: 'DevelopersRecipientProvider'],
        [$class: 'RequesterRecipientProvider']
    ])

    try {
        stage('prepare'){
            checkout scm
            sh "git rev-parse --short HEAD > .git/commit-id"
            commitId = readFile('.git/commit-id').trim()
        }

        stage('test'){
            def myTestContainer = docker.image('node:10')
            myTestContainer.pull()
            myTestContainer.inside {
                sh 'npm install --only=dev'
                sh 'npm test'
                sh 'exit 1' //for testing purpose to check if email is triggered
            }
        }

        stage('docker build'){
            docker.withRegistry('https://index.docker.io/v1/', 'eab0721e-cf6d-4965-aca6-57b2d3f54774') {
            app = docker.build("dnbl/sorter:${commitId}", ".")
            }
        }

        stage('docker push'){
            app.push()
        }
    } 
    catch(e) {
        //mark build as failed
        currentBuild.result = "FAILURE";

        def subject = "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.result}"
        def content = '${JELLY_SCRIPT, template="html"}'

        if (to != null && !to.isEmpty()) {
            emailext(
                body: content, 
                mimeType: 'text/html',
                replyTo: '$DEFAULT_REPLYTO',
                subject: subject,
                to: to,
                attachLog: true 
            )
        }
        throw e;
    }
}
