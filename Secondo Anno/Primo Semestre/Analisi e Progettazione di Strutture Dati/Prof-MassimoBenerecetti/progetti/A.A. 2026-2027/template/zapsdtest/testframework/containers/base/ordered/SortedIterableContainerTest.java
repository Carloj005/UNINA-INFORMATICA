package zapsdtest.testframework.containers.base.ordered;

import static org.junit.jupiter.api.Assertions.*;

import apsd.interfaces.containers.base.ordered.SortedIterableContainer;

public interface SortedIterableContainerTest<Data extends Comparable<? super Data>, Con extends SortedIterableContainer<Con, Data>> extends SortedTraversableContainerTest<Data, Con>, OrderedIterableContainerTest<Data, Con> {

  default void TestSortedOrderViaIterator() {
    BeginTest("SortedOrderViaIterator");
    var iterator = ThisContainer().FIterator();
    Data previous = null;
    while (iterator.IsValid()) {
      Data current = iterator.GetCurrent();
      if (current != null) {
        if (previous != null) {
          assertTrue(previous.compareTo(current) <= 0, "Elements should be in sorted order: " + previous + " <= " + current);
        }
        previous = current;
      }
      iterator.Next();
    }
    EndTest();
  }

}
