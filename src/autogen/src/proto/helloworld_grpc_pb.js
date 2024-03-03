// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var src_proto_helloworld_pb = require('../../src/proto/helloworld_pb.js');

function serialize_helloworld_HelloReply(arg) {
  if (!(arg instanceof src_proto_helloworld_pb.HelloReply)) {
    throw new Error('Expected argument of type helloworld.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_helloworld_HelloReply(buffer_arg) {
  return src_proto_helloworld_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_helloworld_HelloRequest(arg) {
  if (!(arg instanceof src_proto_helloworld_pb.HelloRequest)) {
    throw new Error('Expected argument of type helloworld.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_helloworld_HelloRequest(buffer_arg) {
  return src_proto_helloworld_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var HelloServiceService = exports.HelloServiceService = {
  sayHello: {
    path: '/helloworld.HelloService/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: src_proto_helloworld_pb.HelloRequest,
    responseType: src_proto_helloworld_pb.HelloReply,
    requestSerialize: serialize_helloworld_HelloRequest,
    requestDeserialize: deserialize_helloworld_HelloRequest,
    responseSerialize: serialize_helloworld_HelloReply,
    responseDeserialize: deserialize_helloworld_HelloReply,
  },
};

exports.HelloServiceClient = grpc.makeGenericClientConstructor(HelloServiceService);
