import { Factories, FactoryObject } from "../../Definitions/Factories"

export const Factory = Factories as Required<FactoryObject>

// // export const factoryAudio = () : AudioFactory => {
// //   const factory = Factories[DefinitionType.Audio]
// //   if (!factory) throw Errors.invalid.factory + DefinitionType.Audio

// //   return factory
// // }

// export const factoryDefinitionFromObject = (object: DefinitionObject): Definition => {
//   const { id: definitionId, type } = object
//   if (!(type && isPopulatedString(type))) throw `${Errors.type} Factory.definitionFromObject ${definitionId}`

//   const definitionType = <DefinitionType>type
//   if (!DefinitionTypes.includes(definitionType)) throw `${Errors.type} Factory.definitionFromObject ${definitionType}`

//   if (!(definitionId && isPopulatedString(definitionId))) {
//     throw Errors.invalid.definition.id + JSON.stringify(object)
//   }
//   const factory = Factory[definitionType]

//   return factory.definition(object)
// }



// export const factoryEffect = () : EffectFactory => {
//   const factory = Factories[DefinitionType.Effect]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Effect

//   return factory
// }

// export const factoryFilter = () : FilterFactory => {
//   const factory = Factories[DefinitionType.Filter]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Filter

//   return factory
// }

// export const factoryFont = () : FontFactory => {
//   const factory = Factories[DefinitionType.Font]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Font

//   return factory
// }

// export const factoryImage = () : ImageFactory => {
//   const factory = Factories[DefinitionType.Image]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Image

//   return factory
// }

// export const factoryMerger = () : MergerFactory => {
//   const factory = Factories[DefinitionType.Merger]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Merger

//   return factory
// }

// export const factoryScaler = () : ScalerFactory => {
//   const factory = Factories[DefinitionType.Scaler]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Scaler

//   return factory
// }

// export const factoryTheme = () : ThemeFactory => {
//   const factory = Factories[DefinitionType.Theme]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Theme

//   return factory
// }

// export const factoryTransition = () : TransitionFactory => {
//   const factory = Factories[DefinitionType.Transition]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Transition

//   return factory
// }


// export const factoryVideo = () : VideoFactory => {
//   const factory = Factories[DefinitionType.Video]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.Video

//   return factory
// }

// export const factoryVideoSequence = () : VideoSequenceFactory => {
//   const factory = Factories[DefinitionType.VideoSequence]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.VideoSequence

//   return factory
// }

// export const factoryVideoStream = () : VideoStreamFactory => {
//   const factory = Factories[DefinitionType.VideoStream]
//   if (!factory) throw Errors.invalid.factory + DefinitionType.VideoStream

//   return factory
// }


  // definitionFromObject: factoryDefinitionFromObject,
// {
//   [DefinitionType.Audio]: factoryAudio,
//   [DefinitionType.Effect]: factoryEffect,
//   [DefinitionType.Filter]: factoryFilter,
//   [DefinitionType.Font]: factoryFont,
//   [DefinitionType.Image]: factoryImage,
//   [DefinitionType.Merger]: factoryMerger,
//   [DefinitionType.Scaler]: factoryScaler,
//   [DefinitionType.Theme]: factoryTheme,
//   [DefinitionType.Transition]: factoryTransition,
//   [DefinitionType.Video]: factoryVideo,
//   [DefinitionType.VideoSequence]: factoryVideoSequence,
//   [DefinitionType.VideoStream]: factoryVideoStream,
// }
