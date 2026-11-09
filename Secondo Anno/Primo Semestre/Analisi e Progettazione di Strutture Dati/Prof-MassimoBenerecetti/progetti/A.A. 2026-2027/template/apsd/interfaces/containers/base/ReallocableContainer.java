package apsd.interfaces.containers.base;

// import apsd.classes.utilities.Natural;
// import apsd.interfaces.traits.Reallocable;

/** Interface: ClearableContainer che è anche Reallocable. */
public interface ReallocableContainer<T> {
  // Must extend ClearableContainer and Reallocable.
  // T must have a recursive bound.

  /* ************************************************************************ */
  /* Specific member functions of ReallocableContainer                        */
  /* ************************************************************************ */

  double GROW_FACTOR = 2.0; // Must be strictly greater than 1.
  double SHRINK_FACTOR = 2.0; // Must be strictly greater than 1.

  // Capacity
  // Grow
  // Grow
  // Shrink

  /* ************************************************************************ */
  /* Override specific member functions from Container                        */
  /* ************************************************************************ */

  // Size

  /* ************************************************************************ */
  /* Override specific member functions from ClearableContainer               */
  /* ************************************************************************ */

  // Clear

}
