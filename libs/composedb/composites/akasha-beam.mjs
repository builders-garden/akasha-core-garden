export default function compose(akashaContentBlockIdInterface){
  return `interface AkashaContentBlockInterface @loadModel(id: "${akashaContentBlockIdInterface}") {
  id: ID!
}


type BeamBlockRecord{
  order: Int! @int(min: 0, max: 10)
  blockID: StreamID! @documentReference(model: "AkashaContentBlockInterface")
  # block: AkashaContentBlockInterface! @relationDocument(property: "blockID")
}

type BeamEmbeddedType{
  label: String! @string(minLength:3, maxLength: 32)
  embeddedID : StreamID! @documentReference(model: "Node")
  # content: Node! @relationDocument(property: "embeddedID")
}

type BeamLabeled{
  labelType: String! @string(maxLength: 30)
  value: String! @string(minLength:2, maxLength: 60)
}

interface AkashaBeamInterface
 @createModel(description: "AKASHA Beam interface") {
    author: DID! @documentAccount
    content: [BeamBlockRecord!]! @list(maxLength: 10) @immutable
    tags: [BeamLabeled] @list(maxLength: 10) @immutable
    mentions: [DID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    embeddedStream: BeamEmbeddedType @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
 }

type AkashaBeam implements AkashaBeamInterface
  @createModel(accountRelation: LIST, description: "AKASHA Beam v0.4.0")
  @createIndex(fields:[{path:["active"]}])
  @createIndex(fields:[{path:["createdAt"]}])
  @createIndex(fields:[{path:["nsfw"]}])
  @createIndex(fields:[{path:["active"]}, {path:["createdAt"]}, {path:["nsfw"]}]){
    author: DID! @documentAccount
    content: [BeamBlockRecord!]! @list(maxLength: 10) @immutable
    tags: [BeamLabeled] @list(maxLength: 10) @immutable
    mentions: [DID] @list(maxLength: 10) @immutable
    version: CommitID! @documentVersion
    embeddedStream: BeamEmbeddedType @immutable
    active: Boolean!
    createdAt: DateTime! @immutable
    nsfw: Boolean
}
`
}

