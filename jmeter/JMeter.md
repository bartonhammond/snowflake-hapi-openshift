# JMeter

** Setup for recording
[https://jmeter.apache.org/usermanual/jmeter_proxy_step_by_step.pdf](https://jmeter.apache.org/usermanual/jmeter_proxy_step_by_step.pdf)

* start Hapi on port 5000

* **HTTP Request Defaults**
  * IP: 127.0.0.1
  * Port: 5000
  * Protocol: http

* **Recording Controller**

* Workbench
  * Test Script Recorder
    * Global Settings: 8080
    * Target Controller: Use Recording Controller
    * Add "View Results Tree"

* Command line
  * export http_proxy=http://localhost:8080/
  * curl --data "username=barton&password=Passw0rd$" http://127.0.0.1/account/login
