package apsd.interfaces.traits;

/** Trait: L'oggetto è un riferimento immutabile a un dato. */
public interface Reference<Data> {

  Data Get();

  default boolean IsNull() { return (Get() == null); }

}
