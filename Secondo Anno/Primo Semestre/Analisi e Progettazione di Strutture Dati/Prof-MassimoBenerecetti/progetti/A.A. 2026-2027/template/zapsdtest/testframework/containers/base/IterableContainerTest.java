package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.IterableContainer;
import apsd.interfaces.containers.iterators.ForwardIterator;
import apsd.interfaces.containers.iterators.BackwardIterator;

import static org.junit.jupiter.api.Assertions.*;

public interface IterableContainerTest<Data, Con extends IterableContainer<Con, Data>> extends TraversableContainerTest<Data, Con> {

  default void TestFIterator() {
    BeginTest("FIterator");
    ForwardIterator<Data> iterator = ThisContainer().FIterator();
    assertNotNull(iterator, "FIterator should return a non null ForwardIterator");
    EndTest();
  }

  default void TestBIterator() {
    BeginTest("BIterator");
    BackwardIterator<Data> iterator = ThisContainer().BIterator();
    assertNotNull(iterator, "FIterator should return a non null BackwardIterator");
    EndTest();
  }

  default void TestForwardIteration(boolean canBeNull, boolean edgeCase) {
    BeginTest("ForwardIteration");
    ForwardIterator<Data> iterator = ThisContainer().FIterator();
    if (edgeCase) {
      assertFalse(iterator.IsValid(), "Iterator is not valid");
    } else {
      int count = 0;
      while (iterator.IsValid()) {
        if (!canBeNull) assertNotNull(iterator.GetCurrent(), "Iterated element should not be null");
        iterator.Next();
        count++;
      }
      assertEquals(count, ThisContainer().Size().ToLong(), "Should iterate over all elements forwards");
    }
    EndTest();
  }

  default void TestBackwardIteration(boolean canBeNull, boolean edgeCase) {
    BeginTest("BackwardIteration");
    BackwardIterator<Data> iterator = ThisContainer().BIterator();
    if (edgeCase) {
      assertFalse(iterator.IsValid(), "Iterator is not valid");
    } else {
      int count = 0;
      while (iterator.IsValid()) {
        if (!canBeNull) assertNotNull(iterator.GetCurrent(), "Iterated element should not be null");
        iterator.Prev();
        count++;
      }
      assertEquals(count, ThisContainer().Size().ToLong(), "Should iterate over all elements forwards");
    }
    EndTest();
  }

}
