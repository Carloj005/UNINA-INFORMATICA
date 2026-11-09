package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.RemovableContainer;
import apsd.interfaces.containers.base.TraversableContainer;

import static org.junit.jupiter.api.Assertions.*;

public interface RemovableContainerTest<Data, Con extends RemovableContainer<Con, Data>> extends ContainerTest<Con> {

  default void TestRemove(Data element, boolean shouldWork) {
    BeginTest("Remove");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().Remove(element);
    if (shouldWork) {
      assertTrue(result, "Remove should return true for " + element);
      assertEquals(initialSize - 1, ThisContainer().Size().ToLong(), "Size should decrease by 1 after Remove");
    } else {
      assertFalse(result, "Remove should return false for " + element);
      assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should not change after failed Remove");
    }
    EndTest();
  }

  default void TestAllRemoved(TraversableContainer<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("AllRemoved");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().AllRemoved(otherContainer);
    if (shouldWork) {
      assertTrue(result, "AllRemoved should return true");
      assertTrue(ThisContainer().Size().ToLong() < initialSize, "Size should not increase after AllRemoved");
    } else {
      assertFalse(result, "AllRemoved should return false");
      assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should not change after failed AllRemoved");
    }
    EndTest();
  }

  default void TestSomeRemoved(TraversableContainer<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("SomeRemoved");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().SomeRemoved(otherContainer);
    if (shouldWork) {
      assertTrue(result, "SomeRemoved should return true");
      assertTrue(ThisContainer().Size().ToLong() < initialSize, "Size should not increase after SomeRemoved");
    } else {
      assertFalse(result, "SomeRemoved should return false");
      assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should not change after failed SomeRemoved");
    }
    EndTest();
  }

}
