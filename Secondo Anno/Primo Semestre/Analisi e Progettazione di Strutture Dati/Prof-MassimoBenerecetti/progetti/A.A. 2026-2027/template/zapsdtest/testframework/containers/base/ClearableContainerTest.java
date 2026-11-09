package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.ClearableContainer;

import static org.junit.jupiter.api.Assertions.*;

public interface ClearableContainerTest<Con extends ClearableContainer<Con>> extends ContainerTest<Con> {

  default void TestClear() {
    BeginTest("Clear");
    ThisContainer().Clear();
    assertTrue(ThisContainer().IsEmpty(), "Container should be empty after clear");
    assertTrue(ThisContainer().Size().IsZero(), "Size should be zero after clear");
    EndTest();
  }

  default void TestDoubleClear() {
    BeginTest("DoubleClear");
    ThisContainer().Clear();
    ThisContainer().Clear();
    assertTrue(ThisContainer().IsEmpty(), "Container should be empty after multiple clears");
    assertTrue(ThisContainer().Size().IsZero(), "Size should be zero after multiple clears");
    EndTest();
  }

}
