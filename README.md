Hapi Server running local or on OpenShift in support of Snowflake
====================================================================
This is a sample Hapi Server that supports basic User Authentication
locally on running on OpenShift.


Steps to get your custom Node.js version running on OpenShift
----------------------------------------------------------

* Create an account at http://openshift.redhat.com/

* Install the command line tool ```rhc```

* Create a namespace, if you haven't already do so

  ```  rhc domain create <yournamespace>```

* Create a nodejs application (you can name it anything via -a)

   ``` rhc app create -a mysnowflake  -t nodejs-0.10 mongodb-2.4 rockmongo-1.1```

* Add this repository
```
    cd mysnowflake
    git remote add upstream -m master git://github.com/bartonhammond/snowflake-hapi-openshift.git
    git pull -s recursive -X theirs upstream master
```

* Then push the repo to OpenShift
```
    git push
``
That's it, you can now checkout your application at:[ http://mysnowflake-$yournamespace.rhcloud.com](http://mysnowflake-$yournamespace.rhcloud.com/)

