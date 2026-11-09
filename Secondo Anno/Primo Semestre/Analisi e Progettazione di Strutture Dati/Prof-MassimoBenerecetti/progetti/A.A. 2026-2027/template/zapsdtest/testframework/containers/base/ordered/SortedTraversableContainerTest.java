package zapsdtest.testframework.containers.base.ordered;

import static org.junit.jupiter.api.Assertions.*;

import apsd.classes.utilities.Box;
import apsd.interfaces.containers.base.ordered.SortedTraversableContainer;

public interface SortedTraversableContainerTest<Data extends Comparable<? super Data>, Con extends SortedTraversableContainer<Con, Data>> extends OrderedTraversableContainerTest<Data, Con> {

  default void TestSortedOrderViaTraverse() {
    BeginTest("SortedOrderViaTraverse");
    Box<Data> previous = new Box<>();
    Box<Data> current = new Box<>();
    assertTrue(
      ThisContainer().TraverseForward(
        dat -> {
          if (!previous.IsNull() && previous.Get().compareTo(dat) > 0) {
            current.Set(dat);
            return true;
          } else {
            previous.Set(dat);
            return false;
          }
        }
      ),
      "Elements should be in sorted order: " + previous + " <= " + current
    );
    EndTest();
  }

}
