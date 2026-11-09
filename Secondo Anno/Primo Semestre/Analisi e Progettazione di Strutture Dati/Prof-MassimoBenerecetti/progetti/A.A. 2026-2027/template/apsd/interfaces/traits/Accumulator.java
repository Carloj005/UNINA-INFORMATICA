package apsd.interfaces.traits;

/** Trait: E' una funziona accumulatrice. */
@FunctionalInterface
public interface Accumulator<Data, Acc> {

  Acc Apply(Data dat, Acc acc);

}
