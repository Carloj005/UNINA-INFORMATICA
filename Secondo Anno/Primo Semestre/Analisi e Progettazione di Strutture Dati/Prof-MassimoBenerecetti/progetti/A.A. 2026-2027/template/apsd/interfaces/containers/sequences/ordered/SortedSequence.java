package apsd.interfaces.containers.sequences.ordered;

// import apsd.classes.utilities.Natural;
// import apsd.interfaces.containers.base.ordered.SortedIterableContainer;

/** Interface: OrderedSequence & SortedIterableContainer. */
public interface SortedSequence<T, Data> {
  // Must extend OrderedSequence and SortedIterableContainer.
  // T must have a recursive bound.
  // Data must extend Comparable.

  /* ************************************************************************ */
  /* Override specific member functions from MembershipContainer              */
  /* ************************************************************************ */

  // Exists

  /* ************************************************************************ */
  /* Override specific member functions from OrderedContainer                 */
  /* ************************************************************************ */

  // Min
  // Max
  // Predecessor
  // Successor

  /* ************************************************************************ */
  /* Override specific member functions from Sequence                         */
  /* ************************************************************************ */

  // Search

  /* ************************************************************************ */
  /* Override specific member functions from OrderedSequence                  */
  /* ************************************************************************ */

  // SearchPredecessor
  // SearchSuccessor

}
