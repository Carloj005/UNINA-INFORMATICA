package apsd.interfaces.containers.base;

// import apsd.classes.utilities.Box;
// import apsd.classes.utilities.MutableNatural;
// import apsd.classes.utilities.Natural;
// import apsd.interfaces.traits.Accumulator;
// import apsd.interfaces.traits.Predicate;

/** Interface: MembershipContainer con supporto all'attraversamento. */
public interface TraversableContainer<T, Data> {
  // Must extend MembershipContainer.
  // T must have a recursive bound.

  /* ************************************************************************ */
  /* Specific member functions of TraversableContainer                        */
  /* ************************************************************************ */

  // TraverseForward
  // TraverseBackward
  // FoldForward
  // FoldBackward
  // Multiplicity
  // IsEqual

  /* ************************************************************************ */
  /* Override specific member functions from Container                        */
  /* ************************************************************************ */

  // Size

  /* ************************************************************************ */
  /* Override specific member functions from MembershipContainer              */
  /* ************************************************************************ */

  // Exists

}
