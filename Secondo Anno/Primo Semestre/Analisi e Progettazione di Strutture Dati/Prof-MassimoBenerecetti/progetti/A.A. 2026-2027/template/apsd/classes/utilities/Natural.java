package apsd.classes.utilities;

import java.util.Objects;

/** Object: Represents a natural number in an immutable form. */
public final class Natural implements Comparable<Natural> {

  /** The internal long value of the natural number. */
  private final long num;

  /**
   * Constructs a Natural number from a specified long value.
   * @param num The value of the natural number; it must be non-negative.
   * @throws IllegalArgumentException if the value is negative.
   */
  public Natural(long num) throws IllegalArgumentException {
    if (num < 0) throw new IllegalArgumentException("Natural cannot be negative: " + num + "!");
    this.num = num;
  }

  /**
   * Constructs a Natural number from a {@link MutableNatural}.
   * @param mutnat The mutable natural number; it must be non-null.
   * @throws NullPointerException if {@code mutnat} is null.
   */
  public Natural(MutableNatural mutnat) throws NullPointerException {
    if (mutnat == null) throw new NullPointerException("MutableNatural cannot be null!");
    num = mutnat.ToLong();
  }

  /**
   * Copy constructor.
   * @param nat The natural number; it must be non-null.
   * @throws NullPointerException if {@code nat} is null.
   */
  public Natural(Natural nat) throws NullPointerException {
    if (nat == null) { throw new NullPointerException("Natural cannot be null!"); }
    num = nat.num;
  }

  /* ************************************************************************ */
  /* Specific member functions of Natural                                     */
  /* ************************************************************************ */

  /**
   * @return {@code true} if this natural number is zero, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsZero() {
    return (num == 0);
  }

  /**
   * @return {@code true} if this natural number is not zero, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsNotZero() {
    return (num != 0);
  }

  /**
   * @return {@code true} if this natural number is one, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsOne() {
    return (num == 1);
  }

  /**
   * @return {@code true} if this natural number is not one, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsNotOne() {
    return (num != 1);
  }

  /**
   * @return a new Natural incremented by 1.
   * @throws ArithmeticException if the increment causes an overflow.
   */
  public Natural Increment() throws ArithmeticException {
    if (num == Long.MAX_VALUE) throw new ArithmeticException("Overflow: cannot increment Long.MAX_VALUE!");
    return Natural.Of(num + 1);
  }

  /**
   * @return a new Natural decremented by 1.
   * @throws ArithmeticException if the decrement causes an underflow.
   */
  public Natural Decrement() throws ArithmeticException {
    if (num == 0) throw new ArithmeticException("Underflow: cannot decrement zero!");
    return Natural.Of(num - 1);
  }

  /**
   * @return The value of the natural number as a long.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any except.
   */
  public long ToLong() {
    return num;
  }

  /**
   * @return a new {@link MutableNatural} with the same value as this {@code Natural}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public MutableNatural ToMutableNatural() {
    return new MutableNatural(num);
  }

  /* ************************************************************************ */
  /* Override specific member functions from Comparable<Natural>              */
  /* ************************************************************************ */

  @Override
  public int compareTo(Natural nat) {
    return Long.compare(num, nat.num);
  }

  /* ************************************************************************ */
  /* Override specific member functions from Object                           */
  /* ************************************************************************ */

  @Override
  public int hashCode() {
    return Objects.hash(num);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof Natural)) return false;
    return (num == ((Natural) obj).num);
  }

  @Override
  public String toString() {
    return Long.toString(num);
  }

  /* ************************************************************************ */
  /* Static attributes and factory methods                                    */
  /* ************************************************************************ */

  /** Cached constants for Natural zero and one. */
  public static final Natural ZERO = new Natural(0L);
  public static final Natural ONE = new Natural(1L);

  /**
   * Factory method for any non-negative value.
   * @param num the value to wrap.
   * @return the Natural representing {@code num}
   * @throws IllegalArgumentException if num < 0
   */
  public static Natural Of(long num) {
    if (num == 0)
      return ZERO;
    if (num == 1)
      return ONE;
    return new Natural(num);
  }

  /**
   * Factory method for any MutableNatural value.
   * @param mutnat the value to cast.
   * @return the Natural representing {@code mutnat}
   */
  public static Natural Of(MutableNatural mutnat) {
    if (mutnat == null) throw new NullPointerException("MutableNatural cannot be null!");
    if (mutnat.IsZero())
      return ZERO;
    if (mutnat.IsOne())
      return ONE;
    return new Natural(mutnat);
  }

  /**
   * Factory method for any Natural value.
   * @param nat the value to cast.
   * @return the Natural representing {@code nat}
   */
  public static Natural Of(Natural nat) {
    if (nat == null) throw new NullPointerException("Natural cannot be null!");
    if (nat.IsZero())
      return ZERO;
    if (nat.IsOne())
      return ONE;
    return new Natural(nat);
  }

}
