var Bus = require('../../system/core/bus'),
  assert = require('assert')

function print( obj){
  console.log( JSON.stringify(obj, null, 4))
}

describe('bus test.',function(){
  it("should save and retrieve data correctly", function( ){
    var bus = new Bus,
      naiveData = "hahaah",
      objectData = {name:"hahaha"}

    bus.start()


    bus.data("module.data1", naiveData)
    bus.data("module.data2", objectData)

    console.log( bus.$$data )

    assert.equal( bus.data("module.data1").toString(), naiveData.toString())
    assert.equal( bus.data("module.data2").toString(), objectData.toString())
  })

  it("snapshot should share runtime with fork object", function(){
    var bus = new Bus,
    forkedBus = bus.fork(),
    snapshotBus = forkedBus.snapshot()
  })

  it("should fire with decorator", function( ){
    var bus = (new Bus).fork(),
      event = "someEvent"

      bus.on(event+".before",function before(){
        console.log("before",event)
      })

      bus.on(event,function on(){
        console.log( "on",event)
      })

    bus.on(event+".after",function after(){
      console.log( "after",event)
    })

    bus.start()
    var res = bus.fireWithDecorator( event).then(function(){

      print( bus.$$traceStack )

    })
  })
})