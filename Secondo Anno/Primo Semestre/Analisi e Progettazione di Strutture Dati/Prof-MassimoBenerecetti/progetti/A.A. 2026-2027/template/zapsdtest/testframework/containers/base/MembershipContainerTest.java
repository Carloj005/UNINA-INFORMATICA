package zapsdtest.testframework.containers.base;

import apsd.interfaces.containers.base.MembershipContainer;

import static org.junit.jupiter.api.Assertions.*;

public interface MembershipContainerTest<Data, Con extends MembershipContainer<Con, Data>> extends ContainerTest<Con> {

  default void TestExists(Data element, boolean shouldWork) {
    BeginTest("Exists");
    boolean result = ThisContainer().Exists(element);
    if (shouldWork) {
      assertTrue(result, "Exists should return true for " + element);
    } else {
      assertFalse(result, "Exists should return false for " + element);
    }
    EndTest();
  }

  default void TestExistsNull(boolean shouldWork) {
    BeginTest("ExistsNull");
    boolean result = ThisContainer().Exists(null);
    if (shouldWork) {
      assertTrue(result, "Exists should return true for null");
    } else {
      assertFalse(result, "Exists should return false for null");
    }
    EndTest();
  }

}
