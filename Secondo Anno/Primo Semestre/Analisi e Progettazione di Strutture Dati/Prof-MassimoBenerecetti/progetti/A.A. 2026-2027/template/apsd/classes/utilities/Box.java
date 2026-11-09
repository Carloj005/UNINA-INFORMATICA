package apsd.classes.utilities;

import apsd.interfaces.traits.MutableReference;
import java.util.Objects;

/**
 * Object: Represents a mutable box for a single value of type Data.
 * It can be used to simulate a C++ reference in Java.
 */
public class Box<Data> implements MutableReference<Data> {

  /** The internal value stored in this Box. */
  protected Data dat = null;

  /**
   * Default constructor.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public Box() {}

  /**
   * Constructs a Box containing the specified value.
   * @param dat The value to store.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public Box(Data dat) {
    this.dat = dat;
  }

  /**
   * Copy constructor.
   * @param box The Box to copy; it must be non-null.
   * @throws NullPointerException if {@code box} is null.
   */
  public Box(Box<Data> box) throws NullPointerException {
    if (box == null) { throw new NullPointerException("Box cannot be null!"); }
    this.dat = box.dat;
  }

  /**
   * Assignment method.
   * @param box The Box to copy; it must be non-null.
   * @throws NullPointerException if {@code box} is null.
   */
  public void Assign(Box<Data> box) throws NullPointerException {
    if (box == null) { throw new NullPointerException("Box cannot be null!"); }
    this.dat = box.dat;
  }

  /* ************************************************************************ */
  /* Override specific member functions from Reference                        */
  /* ************************************************************************ */

  /**
   * @return The value stored in this Box.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  @Override
  public Data Get() {
    return dat;
  }

  /* ************************************************************************ */
  /* Override specific member functions from MutableReference                 */
  /* ************************************************************************ */

  /**
   * @param dat The new value to store in this box.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  @Override
  public void Set(Data dat) {
    this.dat = dat;
  }

  /* ************************************************************************ */
  /* Override specific member functions from Object                           */
  /* ************************************************************************ */

  @Override
  public int hashCode() {
    return Objects.hash(dat);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Box<?>)) return false;
    return Objects.equals(dat, ((Box<?>) obj).dat);
  }

  @Override
  public String toString() {
    return "Box(" + dat + ")";
  }

}
