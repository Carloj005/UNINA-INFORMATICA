package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.InsertableContainer;
import apsd.interfaces.containers.base.TraversableContainer;

import static org.junit.jupiter.api.Assertions.*;

public interface InsertableContainerTest<Data, Con extends InsertableContainer<Con,Data>> extends ContainerTest<Con> {

  default void TestInsert(Data element, boolean shouldWork) {
    BeginTest("Insert");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().Insert(element);
    if (shouldWork) {
      assertTrue(result, "Insert should return true for " + element);
      assertEquals(initialSize + 1, ThisContainer().Size().ToLong(), "Size should increase by 1 after Insert");
    } else {
      assertFalse(result, "Insert should return false for " + element);
      assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should not change after failed Insert");
    }
    EndTest();
  }

  default void TestAllInserted(TraversableContainer<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("AllInserted");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().AllInserted(otherContainer);
    if (shouldWork) {
      assertTrue(result, "AllInserted should return true");
      assertTrue(ThisContainer().Size().ToLong() > initialSize, "Size should not decrease after AllInserted");
    } else {
      assertFalse(result, "AllInserted should return false");
      assertTrue(ThisContainer().Size().ToLong() < initialSize + otherContainer.Size().ToLong(), "Size should not change after failed AllInserted");
    }
    EndTest();
  }

  default void TestSomeInserted(TraversableContainer<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("SomeInserted");
    long initialSize = ThisContainer().Size().ToLong();
    boolean result = ThisContainer().SomeInserted(otherContainer);
    if (shouldWork) {
      assertTrue(result, "SomeInserted should return true");
      assertTrue(ThisContainer().Size().ToLong() > initialSize, "Size should not decrease after SomeInserted");
    } else {
      assertFalse(result, "SomeInserted should return false");
      assertEquals(initialSize, ThisContainer().Size().ToLong(), "Size should not change after failed SomeInserted");
    }
    EndTest();
  }

}
