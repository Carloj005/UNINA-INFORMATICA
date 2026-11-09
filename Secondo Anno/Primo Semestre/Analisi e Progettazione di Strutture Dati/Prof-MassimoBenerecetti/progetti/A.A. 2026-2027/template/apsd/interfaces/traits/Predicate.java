package apsd.interfaces.traits;

/** Trait: E' una funziona booleana. */
@FunctionalInterface
public interface Predicate<Data> {

  boolean Apply(Data dat);

}
