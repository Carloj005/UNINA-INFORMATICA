package zapsdtest.testframework.containers.collections;

import apsd.interfaces.containers.collections.Set;

import static org.junit.jupiter.api.Assertions.*;


public interface SetTest<Data, Con extends Set<Con, Data>> extends CollectionTest<Data, Con> {

  default void TestIsEqual(Set<?, Data> otherContainer, boolean shouldWork) {
    BeginTest("IsEqual");
    boolean result = ThisContainer().IsEqual(otherContainer);
    if (shouldWork) {
      assertTrue(result, "IsEqual (Set) should return true");
    } else {
      assertFalse(result, "IsEqual (Set) should return false");
    }
    EndTest();
  }

}
