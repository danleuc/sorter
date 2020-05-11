job('sorter-dsl') {
    scm {
        git('https://github.com/danleuc/sorter.git') {  node -> // is hudson.plugins.git.GitSCM
            node / gitConfigName('DSL User')
            node / gitConfigEmail('bedy88@gmail.com')
        }
    }
    triggers {
        scm('H/5 * * * *')
    }
    wrappers {
        nodejs('NodeJS') // this is the name of the NodeJS installation in 
                         // Manage Jenkins -> Configure Tools -> NodeJS Installations -> Name
    }
    steps {
        dockerBuildAndPublish {
            repositoryName('dnbl/sorter')
            tag('${GIT_REVISION,length=9}')
            registryCredentials('eab0721e-cf6d-4965-aca6-57b2d3f54774')
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
}