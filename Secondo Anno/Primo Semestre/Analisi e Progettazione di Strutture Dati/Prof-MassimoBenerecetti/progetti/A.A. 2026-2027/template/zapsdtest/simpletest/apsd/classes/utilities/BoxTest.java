package zapsdtest.simpletest.apsd.classes.utilities;

import apsd.classes.utilities.Box;

import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Box Tests")
public class BoxTest {

  private Box<Object> createNullBox() {
    return new Box<>();
  }

  private Box<Integer> createIntegerBox() {
    return new Box<>(42);
  }

  private Box<String> createStringBox() {
    return new Box<>("Test");
  }

  // **** Test Constructors & Assignments *********************************** //

  @Nested
  @DisplayName("Constructors & Assignments")
  public class ConstructorsAssignmentsTests {

    @Test
    public void TestDefaultConstructor() {
      Box<String> box = new Box<>();
      assertNull(box.Get(), "Default constructor should initialize with null");
      assertTrue(box.IsNull(), "IsNull() should return true for default constructed box");
    }

    @Test
    public void TestParameterizedConstructor() {
      Box<String> box = new Box<>("initial");
      assertEquals("initial", box.Get(), "Parameterized constructor should set the value");
    }

    @Test
    public void TestCopyConstructor_NullSource() {
      assertThrows(NullPointerException.class, () -> {
        new Box<String>((Box<String>) null);
      }, "Copy constructor should throw NullPointerException for null source");
    }

    @Test
    public void TestCopyConstructor() {
      Box<String> original = new Box<>("original");
      Box<String> copy = new Box<>(original);
      assertEquals(original.Get(), copy.Get(), "Copy constructor should copy the value");
      original.Set("modified");
      assertEquals("original", copy.Get(), "Copy should be independent of original");
    }

    @Test
    public void TestAssign_NullSource() {
      Box<String> target = new Box<>("target");
      assertThrows(NullPointerException.class, () -> {
        target.Assign(null);
      }, "Assign should throw NullPointerException for null source");
    }

    @Test
    public void TestAssign() {
      Box<String> target = new Box<>("target");
      Box<String> source = new Box<>("source");
      target.Assign(source);
      assertEquals("source", target.Get(), "Assign should copy the value from source");
    }

  }

  // **** Test Object Methods *********************************************** //

  @Nested
  @DisplayName("Object")
  public class ObjectTests {

    @Test
    public void TestEquals_NullValues() {
      Box<String> box1 = new Box<>();
      Box<String> box2 = new Box<>();
      assertEquals(box1, box2, "Boxes with null values should be equal");
    }

    @Test
    public void TestEquals_SameValue() {
      Box<String> box1 = new Box<>("value");
      Box<String> box2 = new Box<>("value");
      assertEquals(box1, box2, "Boxes with same value should be equal");
      assertEquals(box1.hashCode(), box2.hashCode(), "Boxes with same value should have same hashCode");
    }

    @Test
    public void TestEquals_DifferentValues() {
      Box<String> box1 = new Box<>("value1");
      Box<String> box2 = new Box<>("value2");
      assertNotEquals(box1, box2, "Boxes with different values should not be equal");
    }

    @Test
    public void TestToString() {
      Box<String> box = new Box<>("Test");
      String str = box.toString();
      assertTrue(str.contains("Box(Test)") && str.contains("Test"), "toString should contain class name and value");
    }

  }

  // **** Test Reference Interface ****************************************** //

  @Nested
  @DisplayName("Reference Interface")
  public class ReferenceInterfaceTests {

    @Test
    public void TestGet_NullValue() {
      Box<Object> box = createNullBox();
      Object value = box.Get();
      assertNull(value, "Get() should return null for uninitialized box");
    }

    @Test
    public void TestGet_WithValue() {
      Box<String> box = createStringBox();
      String value = box.Get();
      assertEquals("Test", value, "Get() should return the stored value");
    }

    @Test
    public void TestIsNull_NullValue() {
      Box<Object> box = createNullBox();
      assertTrue(box.IsNull(), "IsNull() should return true for box with null value");
    }

    @Test
    public void TestIsNull_WithValue() {
      Box<String> box = createStringBox();
      assertFalse(box.IsNull(), "IsNull() should return false for box with value");
    }

  }

  // **** Test MutableReference Interface *********************************** //

  @Nested
  @DisplayName("MutableReference Interface")
  public class MutableReferenceInterfaceTests {

    @Test
    public void TestSet_NullValue() {
      Box<String> box = createStringBox();
      box.Set(null);
      assertNull(box.Get(), "Get() should return null after Set(null)");
      assertTrue(box.IsNull(), "IsNull() should return true after Set(null)");
    }

    @Test
    public void TestGetNSet() {
      Box<Integer> box = createIntegerBox();
      Integer oldValue = box.GetNSet(100);
      assertEquals(42, oldValue, "GetNSet should return the old value");
      assertEquals(100, box.Get(), "Get() should return the new value after GetNSet(...)");
    }

    @Test
    public void TestSet_NewValue() {
      Box<String> box = createStringBox();
      box.Set("New Value");
      assertEquals("New Value", box.Get(), "Get() should return the new value after Set(...)");
    }

    @Test
    public void TestGetNSet_Null() {
      Box<String> box = createStringBox();
      String oldValue = box.GetNSet(null);
      assertEquals("Test", oldValue, "GetNSet should return the old value");
      assertNull(box.Get(), "Get() should return null after GetNSet(null)");
    }

  }

}
