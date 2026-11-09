package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.MutableIterableContainer;
import apsd.interfaces.containers.iterators.MutableForwardIterator;
import apsd.interfaces.containers.iterators.MutableBackwardIterator;

import static org.junit.jupiter.api.Assertions.*;

public interface MutableIterableContainerTest<Data, Con extends MutableIterableContainer<Con, Data>> extends IterableContainerTest<Data, Con> {

  default void TestSetCurrentForward(long steps, Data oldElement, Data newElement, boolean edgeCase) {
    BeginTest("SetCurrentForward");
    MutableForwardIterator<Data> iterator = ThisContainer().FIterator();
    if (edgeCase) {
      assertFalse(iterator.IsValid(), "Iterator is not valid");
    } else {
      assertTrue(iterator.IsValid(), "Iterator is valid");
      iterator.Next(steps);
      assertTrue(iterator.IsValid(), "Iterator is valid");
      Data original = iterator.GetCurrent();
      iterator.SetCurrent(newElement);
      assertEquals(oldElement, original, "Old element should be " + oldElement + " and is " + original);
      assertEquals(newElement, iterator.GetCurrent(), "SetCurrent should modify current element " + original + " to " + newElement);
    }
    EndTest();
  }

  default void TestSetCurrentBackward(long steps, Data oldElement, Data newElement, boolean edgeCase) {
    BeginTest("SetCurrentBackward");
    MutableBackwardIterator<Data> iterator = ThisContainer().BIterator();
    if (edgeCase) {
      assertFalse(iterator.IsValid(), "Iterator is not valid");
    } else {
      assertTrue(iterator.IsValid(), "Iterator is valid");
      iterator.Prev(steps);
      assertTrue(iterator.IsValid(), "Iterator is valid");
      Data original = iterator.GetCurrent();
      iterator.SetCurrent(newElement);
      assertEquals(oldElement, original, "Old element should be " + oldElement + " and is " + original);
      assertEquals(newElement, iterator.GetCurrent(), "SetCurrent should modify current element " + original + " to " + newElement);
    }
    EndTest();
  }

}
