// package: helloworld
// file: src/proto/helloworld.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as src_proto_helloworld_pb from "../../src/proto/helloworld_pb";

interface IHelloServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sayHello: IHelloServiceService_ISayHello;
}

interface IHelloServiceService_ISayHello extends grpc.MethodDefinition<src_proto_helloworld_pb.HelloRequest, src_proto_helloworld_pb.HelloReply> {
    path: "/helloworld.HelloService/SayHello";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<src_proto_helloworld_pb.HelloRequest>;
    requestDeserialize: grpc.deserialize<src_proto_helloworld_pb.HelloRequest>;
    responseSerialize: grpc.serialize<src_proto_helloworld_pb.HelloReply>;
    responseDeserialize: grpc.deserialize<src_proto_helloworld_pb.HelloReply>;
}

export const HelloServiceService: IHelloServiceService;

export interface IHelloServiceServer extends grpc.UntypedServiceImplementation {
    sayHello: grpc.handleUnaryCall<src_proto_helloworld_pb.HelloRequest, src_proto_helloworld_pb.HelloReply>;
}

export interface IHelloServiceClient {
    sayHello(request: src_proto_helloworld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: src_proto_helloworld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    sayHello(request: src_proto_helloworld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
}

export class HelloServiceClient extends grpc.Client implements IHelloServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sayHello(request: src_proto_helloworld_pb.HelloRequest, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: src_proto_helloworld_pb.HelloRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
    public sayHello(request: src_proto_helloworld_pb.HelloRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: src_proto_helloworld_pb.HelloReply) => void): grpc.ClientUnaryCall;
}
