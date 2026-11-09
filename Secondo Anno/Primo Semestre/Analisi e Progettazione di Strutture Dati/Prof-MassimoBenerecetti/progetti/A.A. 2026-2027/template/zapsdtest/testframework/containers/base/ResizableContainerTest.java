package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.ReallocableContainer;
import apsd.interfaces.containers.base.ResizableContainer;
import apsd.classes.utilities.Natural;

import static org.junit.jupiter.api.Assertions.*;

public interface ResizableContainerTest<Con extends ResizableContainer<Con>> extends ReallocableContainerTest<Con> {

  default void TestExpand() {
    BeginTest("Expand");
    long initialSize = ThisContainer().Size().ToLong();
    long initialCapacity = ThisContainer().Capacity().ToLong();
    ThisContainer().Expand();
    assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after Expand");
    if (initialSize + 1 < initialCapacity) {
      assertEquals(initialCapacity, ThisContainer().Capacity().ToLong(), "Capacity should not change after Expand with sufficient free space");
    } else {
      assertTrue(initialCapacity < ThisContainer().Capacity().ToLong(), "Capacity needs to increase after Expand without sufficient free space");
    }
    EndTest();
  }

  default void TestExpandWithNumber(long number) {
    BeginTest("ExpandWithNumber");
    long initialSize = ThisContainer().Size().ToLong();
    long initialCapacity = ThisContainer().Capacity().ToLong();
    ThisContainer().Expand(Natural.Of(number));
    assertEquals(initialSize + number, ThisContainer().Size().ToLong(), "Size should increase by " + number + " after Expand");
    if (initialSize + number < initialCapacity) {
      assertEquals(initialCapacity, ThisContainer().Capacity().ToLong(), "Capacity should not change after Expand with sufficient free space");
    } else {
      assertTrue(initialCapacity < ThisContainer().Capacity().ToLong(), "Capacity needs to increase after Expand without sufficient free space");
    }
    EndTest();
  }

  default void TestReduce() {
    BeginTest("Reduce");
    long initialSize = ThisContainer().Size().ToLong();
    long initialCapacity = ThisContainer().Capacity().ToLong();
    ThisContainer().Reduce();
    assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after Reduce");
    if (ResizableContainer.THRESHOLD_FACTOR * ReallocableContainer.SHRINK_FACTOR * (initialSize - 1) > initialCapacity) {
      assertEquals(initialCapacity, ThisContainer().Capacity().ToLong(), "Capacity should not change after Reduce without enough free space");
    } else {
      assertTrue(initialCapacity > ThisContainer().Capacity().ToLong(), "Capacity needs to reduce after Reduce with a lot of free space");
    }
    EndTest();
  }

  default void TestReduceWithNumber(long number) {
    BeginTest("ReduceWithNumber");
    long initialSize = ThisContainer().Size().ToLong();
    long initialCapacity = ThisContainer().Capacity().ToLong();
    ThisContainer().Reduce(Natural.Of(number));
    assertEquals(initialSize - number, ThisContainer().Size().ToLong(), "Size should decrease by " + number + " after Reduce");
    if (ResizableContainer.THRESHOLD_FACTOR * ReallocableContainer.SHRINK_FACTOR * (initialSize - number) > initialCapacity) {
      assertEquals(initialCapacity, ThisContainer().Capacity().ToLong(), "Capacity should not change after Reduce without enough free space");
    } else {
      assertTrue(initialCapacity > ThisContainer().Capacity().ToLong(), "Capacity needs to reduce after Reduce with a lot of free space");
    }
    EndTest();
  }

}
