package apsd.interfaces.traits;

/** Trait: L'oggetto è un riferimento mutabile a un dato. */
public interface MutableReference<Data> extends Reference<Data> {

  void Set(Data dat);

  default Data GetNSet(Data newdat) {
    Data dat = Get();
    Set(newdat);
    return dat;
  }

}
