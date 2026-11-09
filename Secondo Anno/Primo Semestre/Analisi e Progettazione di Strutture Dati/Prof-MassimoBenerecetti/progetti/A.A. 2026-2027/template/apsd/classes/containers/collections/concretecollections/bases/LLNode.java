package apsd.classes.containers.collections.concretecollections.bases;

import apsd.classes.utilities.Box;
import apsd.interfaces.traits.MutableReference;
import java.util.Objects;

/** Object: Represents a mutable linked-list node for a value of type Data. */
public class LLNode<Data> implements MutableReference<Data> {

  protected Data dat = null;
  protected Box<LLNode<Data>> next = new Box<>();

  public LLNode() {}

  public LLNode(Data dat) { this.dat = dat; }

  public LLNode(Data dat, LLNode<Data> nextnode) {
    this(dat);
    next.Set(nextnode);
  }

  public LLNode(LLNode<Data> node) {
    if (node == null) { throw new NullPointerException("LLNode cannot be null!"); }
    dat = node.dat;
    next.Set(node.next.Get() == null ? null : new LLNode<>(node.next.Get()));
  }

  /* ************************************************************************ */
  /* Specific member functions of LLNode                                      */
  /* ************************************************************************ */

  public Box<LLNode<Data>> GetNext() { return next; }

  public void SetNext(LLNode<Data> nextnode) { next.Set(nextnode); }

  /* ************************************************************************ */
  /* Override specific member functions from Reference                        */
  /* ************************************************************************ */

  @Override
  public Data Get() { return dat; }

  /* ************************************************************************ */
  /* Override specific member functions from MutableReference                 */
  /* ************************************************************************ */

  @Override
  public void Set(Data dat) { this.dat = dat; }

  /* ************************************************************************ */
  /* Override specific member functions from Object                           */
  /* ************************************************************************ */

  @Override
  public int hashCode() {
    return Objects.hash(dat, next.Get());
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof LLNode<?> node)) return false;
    return (next.Get() == node.next.Get() && Objects.equals(dat, node.dat));
  }

  @Override
  public String toString() {
    return "LLNode(data: " + dat + "; next: " + next + " )";
  }

}
