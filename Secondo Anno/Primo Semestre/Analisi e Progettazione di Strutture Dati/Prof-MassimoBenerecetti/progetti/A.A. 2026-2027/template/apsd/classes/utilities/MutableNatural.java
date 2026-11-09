package apsd.classes.utilities;

import java.util.Objects;

/** Object: Represents a natural number in a mutable form. */
public final class MutableNatural {

  /** The internal long value of the natural number. */
  protected long num = 0L;

  /** Constructs a default MutableNatural number equal to zero. */
  public MutableNatural() {}

  /**
   * Constructs a MutableNatural number from a specified long value.
   * @param num The value of the natural number; it must be non-negative.
   * @throws IllegalArgumentException if the value is negative.
   */
  public MutableNatural(long num) throws IllegalArgumentException {
    if (num < 0) { throw new IllegalArgumentException("MutableNatural cannot be negative: " + num + "!"); }
    this.num = num;
  }

  /**
   * Constructs a MutableNatural number from a {@link Natural}.
   * @param nat The immutable natural number; it must be non-null.
   * @throws NullPointerException if {@code nat} is null.
   */
  public MutableNatural(Natural nat) throws NullPointerException {
    if (nat == null) { throw new NullPointerException("Natural cannot be null!"); }
    num = nat.ToLong();
  }

  /**
   * Copy constructor.
   * @param mutnat The mutable natural number; it must be non-null.
   * @throws NullPointerException if {@code mutnat} is null.
   */
  public MutableNatural(MutableNatural mutnat) throws NullPointerException {
    if (mutnat == null) { throw new NullPointerException("MutableNatural cannot be null!"); }
    num = mutnat.num;
  }

  /**
   * Assignment method.
   * @param num The value of the natural number; it must be non-negative.
   * @throws NullPointerException if {@code mutnat} is null.
   */
  public MutableNatural Assign(long num) throws NullPointerException {
    if (num < 0) { throw new IllegalArgumentException("MutableNatural cannot be negative: " + num + "!"); }
    this.num = num;
    return this;
  }

  /**
   * Assignment method.
   * @param mutnat The mutable natural number; it must be non-null.
   * @throws NullPointerException if {@code mutnat} is null.
   */
  public MutableNatural Assign(Natural nat) throws NullPointerException {
    if (nat == null) { throw new NullPointerException("MutableNatural cannot be null!"); }
    num = nat.ToLong();
    return this;
  }

  /**
   * Assignment method.
   * @param mutnat The mutable natural number; it must be non-null.
   * @throws NullPointerException if {@code mutnat} is null.
   */
  public MutableNatural Assign(MutableNatural mutnat) throws NullPointerException {
    if (mutnat == null) { throw new NullPointerException("MutableNatural cannot be null!"); }
    num = mutnat.num;
    return this;
  }

  /* ************************************************************************ */
  /* Specific member functions of MutableNatural                              */
  /* ************************************************************************ */

  /**
   * Sets this natural number to zero (in-place).
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public void Zero() {
    num = 0L;
  }

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
   * Sets this natural number to one (in-place).
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public void One() {
    num = 1L;
  }

  /**
   * @return {@code true} if this natural number is one, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsOne() {
    return (num == 1);
  }

  /**
   * @return {@code true} if this natural number is  notone, otherwise {@code false}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public boolean IsNotOne() {
    return (num != 1);
  }

  /**
   * Increments (in-place) this natural number by 1.
   * @throws ArithmeticException if the increment causes an overflow.
   */
  public void Increment() throws ArithmeticException {
    if (num == Long.MAX_VALUE) { throw new ArithmeticException("Overflow: cannot increment Long.MAX_VALUE!"); }
    num++;
  }

  /**
   * Returns a new {@link Natural} equal to the current value of this mutable number,
   * then increments this {@code MutableNatural} by 1 (post-increment, in-place).
   * @return a new {@link Natural} representing the previous value of this mutable number.
   * @throws ArithmeticException if the increment causes an overflow.
   */
  public Natural GetNIncrement() throws ArithmeticException {
    if (num == Long.MAX_VALUE) { throw new ArithmeticException("Overflow: cannot increment Long.MAX_VALUE!"); }
    return Natural.Of(num++);
  }

  /**
   * Returns a long equal to the current value of this mutable number,
   * then increments this {@code MutableNatural} by 1 (post-increment, in-place).
   * @return a long representing the previous value of this mutable number.
   * @throws ArithmeticException if the increment causes an overflow.
   */
  public long GetLongNIncrement() throws ArithmeticException {
    if (num == Long.MAX_VALUE) { throw new ArithmeticException("Overflow: cannot increment Long.MAX_VALUE!"); }
    return num++;
  }

  /**
   * Decrements (in-place) this natural number by 1.
   * @throws ArithmeticException if the decrement causes an underflow.
   */
  public void Decrement() throws ArithmeticException {
    if (num == 0) { throw new ArithmeticException("Underflow: cannot decrement zero!"); }
    num--;
  }

  /**
   * Returns a new {@link Natural} equal to the current value of this mutable number,
   * then decrements this {@code MutableNatural} by 1 (post-decrement, in-place).
   * @return a new {@link Natural} representing the previous value of this mutable number.
   * @throws ArithmeticException if the decrement causes an underflow.
   */
  public Natural GetNDecrement() throws ArithmeticException {
    if (num == 0) { throw new ArithmeticException("Underflow: cannot decrement zero!"); }
    return Natural.Of(num--);
  }

  /**
   * Returns a long equal to the current value of this mutable number,
   * then decrements this {@code MutableNatural} by 1 (post-decrement, in-place).
   * @return a long representing the previous value of this mutable number.
   * @throws ArithmeticException if the decrement causes an underflow.
   */
  public long GetLongNDecrement() throws ArithmeticException {
    if (num == 0) { throw new ArithmeticException("Underflow: cannot decrement zero!"); }
    return num--;
  }

  /**
   * @return the value of this mutable natural number as a long.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public long ToLong() {
    return num;
  }

  /**
   * @return a new {@link Natural} with the same value as this {@code MutableNatural}.
   * @throws NoSuchFieldError never — this method is guaranteed not to throw any exception.
   */
  public Natural ToNatural() {
    return Natural.Of(num);
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
    if (!(obj instanceof MutableNatural)) return false;
    return (num == ((MutableNatural) obj).num);
  }

  @Override
  public String toString() {
    return Long.toString(num);
  }

  /* ************************************************************************ */
  /* Static attributes and factory methods                                    */
  /* ************************************************************************ */

  /**
   * Factory method for any non-negative value.
   * @param num the value to wrap.
   * @return the MutableNatural representing {@code num}
   * @throws IllegalArgumentException if num < 0
   */
  public static MutableNatural Of(long num) {
    return new MutableNatural(num);
  }

  /**
   * Factory method for any MutableNatural value.
   * @param mutnat the value to cast.
   * @return the MutableNatural representing {@code mutnat}
   */
  public static MutableNatural Of(MutableNatural mutnat) {
    if (mutnat == null) throw new NullPointerException("MutableNatural cannot be null!");
    return new MutableNatural(mutnat);
  }

  /**
   * Factory method for any Natural value.
   * @param nat the value to cast.
   * @return the MutableNatural representing {@code nat}
   */
  public static MutableNatural Of(Natural nat) {
    if (nat == null) throw new NullPointerException("Natural cannot be null!");
    return new MutableNatural(nat);
  }

}
