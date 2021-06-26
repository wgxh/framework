export type Raw<T extends object> = T;
export type Depend = () => void;
export type Depends = Set<Depend>;
export type KeyDepends = Map<string | symbol, Depends>
