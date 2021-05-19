interface FactoryInterface {
}
interface TypedObject {
    type: string;
}
interface TypedObjectConstructor {
    new (object: TypedObject): FactoryInterface;
}
declare class Factory implements FactoryInterface {
    classesByType: Map<string, TypedObjectConstructor>;
    baseClass: TypedObjectConstructor;
    constructor(baseClass: TypedObjectConstructor);
    typeClass(type: string): TypedObjectConstructor;
    create(type: string | TypedObject): object;
    createFromObject(object: TypedObject): object;
    createFromType(type: string): object;
    install(type: string, klass: TypedObjectConstructor): void;
}
export { Factory };
//# sourceMappingURL=moviemasher.d.ts.map