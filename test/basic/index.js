var Bus = require('../../system/core/bus'),
  assert = require('assert'),
  q = require('q')

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


  it("should fire with decorator", function( ){
    var bus = (new Bus).fork(),
      event = "someEvent"

      bus.on(event+".before",function before(){
        console.log("========before",event)
      })

//      bus.on(event,function on(){
//        console.log( "on",event)
//      })

    bus.on(event+".after",function after(){
      console.log( "==========after",event)
    })

    bus.start()
    var res = bus.fcall( event,{},function(){
      console.log("this is =======fn")
    }).then(function(){
      console.log("=========")
      print( bus.$$traceRoot )
    }).catch(function(err){
      console.log("====",err)
    })
  })

  //TODO test allSettled function with promise in promise result
  it("should wait for cas promise resolve or reject", function( cb ){
    q.all([q.promise(function( resolve, reject){
      return q.promise( function(resolve, reject){
        setTimeout( function(){
          reject("hahaha")
        }, 300)
      }).then(resolve).fail(reject)

    }),11]).then(function(a){
      console.log("resolve!!!resolve",a)
      cb()
    }).fail(function(err){
      console.log("reject",err)
      cb()
    })
  })

  it("should wait all nested promise resolve", function( cb ){

    var bus = (new Bus).fork(),
      event = "someEvent"


    bus.on(event,function on(){
        return bus.error("some err")
    })


    bus.start()
    bus.fire( event)

    bus.then( function(){
      cb()
    }).fail(function(){
      console.log("error should fire")
      cb()
    })

  })

  it( "should immediate resolve when fire empty event", function(cb){
    var bus = (new Bus).fork(),
      event = "someEvent"

    bus.start()

    bus.fire( event).then( function(){
      console.log("empty event")
      cb()
    }).fail(function(){
      cb()
    })

  })

  it("should merge data",function(){
    var bus = (new Bus({track:false})).fork()

    bus.start()
    console.log("=========>>>>>>>>")

    bus.data('respond.data',{id:11,name:'111'})

    console.log("=========")
    bus.data('respond.data',{duoshuo:123123})
    console.log( bus.$$data )
    assert.equal( 3, Object.keys( bus['$$data'].respond.data).length)
  })

  it("should execute in order", function( cb ){
    q.Promise(function(resolve, reject){
      resolve()
    }).then(function(){
      return q.Promise(function(resolve){
        setTimeout(function(){
          console.log(1)
          resolve()
        },500)
      })
    }).fail(function(){
      console.log(2)
    }).then(function(){
      console.log(3)
      cb()
    })
  })
})