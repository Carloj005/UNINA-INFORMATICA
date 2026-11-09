package apsd.interfaces.containers.base;

// import apsd.classes.utilities.Natural;

/** Interface: ReallocableContainer che è espandibile e riducibile. */
public interface ResizableContainer<T> {
  // T must have a recursive bound.
  // Must extend ReallocableContainer.

  /* ************************************************************************ */
  /* Specific member functions of ResizableContainer                          */
  /* ************************************************************************ */

  double THRESHOLD_FACTOR = 2.0; // Must be strictly greater than 1.

  // Expand
  // Reduce

  /* ************************************************************************ */
  /* Override specific member functions from Container                        */
  /* ************************************************************************ */

  // Size

  /* ************************************************************************ */
  /* Override specific member functions from ReallocableContainer             */
  /* ************************************************************************ */

  // Grow
  // Shrink

}
